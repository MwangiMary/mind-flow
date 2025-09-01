import z from "zod";

// Journal Entry Schema
export const JournalEntrySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  entry_text: z.string(),
  mood_score: z.number().int().min(0).max(100).nullable(),
  primary_emotion: z.string().nullable(),
  ai_analysis: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;

// API Schemas
export const CreateJournalEntrySchema = z.object({
  entry_text: z.string().min(1, "Journal entry cannot be empty"),
});

export type CreateJournalEntryRequest = z.infer<typeof CreateJournalEntrySchema>;

// Sentiment Analysis Response
export const SentimentAnalysisSchema = z.object({
  mood_score: z.number().min(0).max(100),
  primary_emotion: z.string(),
  analysis: z.string(),
});

export type SentimentAnalysis = z.infer<typeof SentimentAnalysisSchema>;
