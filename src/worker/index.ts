import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { CreateJournalEntrySchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Auth Routes
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Sentiment Analysis Helper
async function analyzeSentiment(text: string, env: Env): Promise<{ mood_score: number; primary_emotion: string; analysis: string }> {
  try {
    // Check if API key is available
    if (!env.HUGGING_FACE_API_KEY) {
      return { mood_score: 50, primary_emotion: "neutral", analysis: "AI analysis temporarily unavailable - API key missing." };
    }

    const response = await fetch("https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        return { mood_score: 50, primary_emotion: "neutral", analysis: "AI analysis temporarily unavailable due to high demand. Please try again later." };
      }
      
      // Handle model loading
      if (response.status === 503) {
        return { mood_score: 50, primary_emotion: "neutral", analysis: "AI model is starting up. This may take a few moments." };
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json() as Array<Array<{ label: string; score: number }>>;
    
    // Validate response structure
    if (!result || !result[0] || !Array.isArray(result[0])) {
      return { mood_score: 50, primary_emotion: "neutral", analysis: "AI analysis completed but results unclear." };
    }

    const sentiments = result[0];
    
    // Find the highest scoring emotion
    const topSentiment = sentiments.reduce((prev: { label: string; score: number }, current: { label: string; score: number }) => 
      (prev.score > current.score) ? prev : current
    );

    // Map sentiment labels to emotions and mood scores
    let primary_emotion = "neutral";
    let mood_score = 50;

    if (topSentiment.label === "LABEL_2") { // Positive
      primary_emotion = "happy";
      mood_score = Math.round(50 + (topSentiment.score * 50));
    } else if (topSentiment.label === "LABEL_0") { // Negative
      primary_emotion = "sad";
      mood_score = Math.round(50 - (topSentiment.score * 50));
    } else { // Neutral or LABEL_1
      primary_emotion = "neutral";
      mood_score = 50;
    }

    const analysis = `AI detected ${primary_emotion} sentiment with ${Math.round(topSentiment.score * 100)}% confidence.`;

    return { mood_score, primary_emotion, analysis };
  } catch (error) {
    // Provide more specific error messages
    if (error instanceof Error && error.message.includes("API error: 401")) {
      return { mood_score: 50, primary_emotion: "neutral", analysis: "AI analysis unavailable - please check API credentials. Your entry has been saved." };
    }
    
    return { mood_score: 50, primary_emotion: "neutral", analysis: "AI analysis temporarily unavailable. Your entry has been saved." };
  }
}

// Journal Entry Routes
app.get("/api/journal-entries", authMiddleware, async (c) => {
  const user = c.get("user")!;
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC"
  )
    .bind(user.id)
    .all();

  return c.json(results);
});

app.post("/api/journal-entries", authMiddleware, zValidator("json", CreateJournalEntrySchema), async (c) => {
  const user = c.get("user")!;
  const { entry_text } = c.req.valid("json");
  
  // Analyze sentiment
  const { mood_score, primary_emotion, analysis } = await analyzeSentiment(entry_text, c.env);
  
  const { results } = await c.env.DB.prepare(
    `INSERT INTO journal_entries (user_id, entry_text, mood_score, primary_emotion, ai_analysis, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
     RETURNING *`
  )
    .bind(user.id, entry_text, mood_score, primary_emotion, analysis)
    .all();

  return c.json(results[0], 201);
});

app.get("/api/journal-entries/:id", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");
  
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM journal_entries WHERE id = ? AND user_id = ?"
  )
    .bind(id, user.id)
    .all();

  if (results.length === 0) {
    return c.json({ error: "Journal entry not found" }, 404);
  }

  return c.json(results[0]);
});

// Serve the Canva guide as a downloadable file
app.get("/canva-guide", async (c) => {
  const content = `# MindFlow Pitch Deck - Canva Guide

## Design Guidelines

### Color Palette
- **Primary Gradients:**
  - Slide 1 & 9: Indigo to Purple (#4F46E5 to #7C3AED)
  - Slide 2: Red to Pink (#EF4444 to #EC4899)
  - Slide 3: Green to Teal (#10B981 to #14B8A6)
  - Slide 4: Blue to Indigo (#3B82F6 to #6366F1)
  - Slide 5: Purple to Indigo (#8B5CF6 to #6366F1)
  - Slide 6: Emerald to Green (#10B981 to #16A34A)
  - Slide 7: Orange to Red (#F97316 to #EF4444)
  - Slide 8: Violet to Purple (#8B5CF6 to #A855F7)

### Typography
- **Main Titles:** Bold, 48-64px
- **Subtitles:** Light, 24-32px
- **Body Text:** Regular, 16-20px
- **Stats/Numbers:** Bold, 32-48px

### Layout
- Use white text on colored gradient backgrounds
- Add subtle transparency overlays (10-20% white) for content boxes
- Include icons from Lucide React icon set equivalents

---

## Slide 1: Title Slide
**Background:** Indigo to Purple gradient
**Layout:** Center-aligned

### Content:
**Icon:** Brain icon (large, centered)
**Title:** MindFlow
**Subtitle:** AI-Powered Mental Wellness Platform
**Description:** Transforming how people understand and improve their emotional health through intelligent journaling and mood analytics.

---

## Slide 2: The Problem
**Background:** Red to Pink gradient
**Layout:** Split layout - icon/title left, bullet points right

### Content:
**Icon:** Heart icon
**Title:** The Mental Health Crisis
**Subtitle:** A growing global challenge

**Bullet Points:**
- 1 in 4 people worldwide experience mental health issues
- Depression and anxiety have increased 25% since COVID-19
- Only 30% of people seek professional help due to cost and stigma
- Traditional therapy has 3-6 month waiting lists
- People lack accessible tools for daily emotional self-awareness

---

## Slide 3: Our Solution
**Background:** Green to Teal gradient
**Layout:** Split layout - icon/title left, bullet points right

### Content:
**Icon:** Brain icon
**Title:** Our Solution
**Subtitle:** AI-powered emotional intelligence

**Bullet Points:**
- Instant AI analysis of journal entries using advanced NLP
- Real-time mood tracking with personalized insights
- Beautiful visualizations to identify emotional patterns
- Accessible 24/7 from any device
- Privacy-first approach with secure data handling

---

## Slide 4: How It Works
**Background:** Blue to Indigo gradient
**Layout:** 2x2 grid of feature boxes

### Content:
**Title:** How MindFlow Works
**Subtitle:** Simple, powerful, intelligent

**Feature Boxes:**

**Box 1:** 
- Icon: Zap/Lightning
- Title: Smart Journaling
- Description: Write freely while AI analyzes sentiment, emotion, and mood patterns in real-time

**Box 2:**
- Icon: Bar Chart
- Title: Mood Analytics
- Description: Beautiful charts and insights help you understand your emotional trends over time

**Box 3:**
- Icon: Target
- Title: Personalized Insights
- Description: AI provides tailored recommendations for improving your mental wellness

**Box 4:**
- Icon: Shield
- Title: Privacy First
- Description: Your data is encrypted and never shared. Complete control over your personal information

---

## Slide 5: Live Demo
**Background:** Purple to Indigo gradient
**Layout:** Center-aligned with demo steps below

### Content:
**Title:** Live Demo
**Subtitle:** See MindFlow in action
**Demo URL:** xutmvobehyo2w.mocha.app

**Demo Steps (5 numbered boxes):**
1. Sign up with Google in seconds
2. Write your first journal entry
3. Watch AI analyze your mood instantly
4. Explore beautiful mood visualizations
5. Track your emotional journey over time

---

## Slide 6: Market Opportunity
**Background:** Emerald to Green gradient
**Layout:** 2x2 grid of stat boxes

### Content:
**Icon:** Trending Up arrow
**Title:** Market Opportunity
**Subtitle:** A $5.6B growing market

**Stat Boxes:**

**Box 1:**
- Value: $5.6B
- Label: Mental Health App Market
- Growth: +23% CAGR

**Box 2:**
- Value: 75M
- Label: Target Users (US)
- Growth: Adults seeking wellness tools

**Box 3:**
- Value: $60/year
- Label: Average Revenue per User
- Growth: Industry standard

**Box 4:**
- Value: <5%
- Label: Market Penetration
- Growth: Huge untapped potential

---

## Slide 7: Business Model
**Background:** Orange to Red gradient
**Layout:** 3 pricing tier columns

### Content:
**Title:** Business Model
**Subtitle:** Freemium with premium features

**Pricing Tiers:**

**Tier 1 - Free:**
- Price: $0
- Features: 5 entries/month, Basic mood tracking, 7-day history

**Tier 2 - Premium (POPULAR):**
- Price: $4.99/mo
- Features: Unlimited entries, Advanced AI insights, Full analytics, Data export
- Badge: "POPULAR" in yellow

**Tier 3 - Enterprise:**
- Price: $50/employee
- Features: Team analytics, Corporate wellness, Custom integrations

---

## Slide 8: Growth Strategy
**Background:** Violet to Purple gradient
**Layout:** 4 timeline milestone boxes

### Content:
**Title:** Growth Strategy
**Subtitle:** Path to 100K users

**Milestones (4 numbered boxes):**

**1. Phase 1:**
- Title: Launch & Validation
- Target: 1K users
- Timeline: Month 1-3

**2. Phase 2:**
- Title: Premium Features
- Target: 10K users
- Timeline: Month 4-8

**3. Phase 3:**
- Title: Enterprise Sales
- Target: 50K users
- Timeline: Month 9-18

**4. Phase 4:**
- Title: Scale & Exit
- Target: 100K+ users
- Timeline: Month 19-36

---

## Slide 9: Next Steps
**Background:** Indigo to Purple gradient
**Layout:** 2x2 grid of action items + contact box

### Content:
**Title:** Next Steps
**Subtitle:** Ready to transform mental wellness

**Action Items (4 numbered boxes):**
1. Try the live demo at xutmvobehyo2w.mocha.app
2. Join our beta program for early access to premium features
3. Partner with us to bring MindFlow to your organization
4. Invest in the future of mental health technology

**Contact Box:**
**Title:** Get Started Today
**Demo:** xutmvobehyo2w.mocha.app
**Contact:** hello@mindflow.app

---

## Canva Tips

1. **Search for templates:** Use "pitch deck", "startup presentation", or "business proposal"
2. **Background gradients:** Use Canva's gradient tool with the hex colors provided
3. **Icons:** Search for "brain", "heart", "chart", "target", "shield", "lightning" in Canva's icon library
4. **Transparency:** Add white rectangle overlays at 10-20% opacity for content boxes
5. **Consistency:** Use the same font family throughout (recommend Montserrat or Open Sans)
6. **Export:** Download as PDF for presentations or PNG for individual slides

## Pro Tips
- Keep slides clean and minimal
- Use plenty of white space
- Make sure text is readable on gradient backgrounds
- Use consistent spacing between elements
- Test readability at different screen sizes`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mindflow-pitch-deck-canva-guide.md"',
    },
  });
});

export default app;
