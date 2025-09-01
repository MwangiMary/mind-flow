import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Brain, TrendingUp, Target, BarChart3, Heart, Shield, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SlideBase {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  background: string;
}

interface TitleSlide extends SlideBase {
  type: "title";
  content: string;
}

interface ProblemSlide extends SlideBase {
  type: "problem";
  content: string[];
  icon: LucideIcon;
}

interface SolutionSlide extends SlideBase {
  type: "solution";
  content: string[];
  icon: LucideIcon;
}

interface FeaturesSlide extends SlideBase {
  type: "features";
  features: Array<{
    icon: LucideIcon;
    title: string;
    description: string;
  }>;
}

interface DemoSlide extends SlideBase {
  type: "demo";
  content: string;
  demoSteps: string[];
}

interface MarketSlide extends SlideBase {
  type: "market";
  icon: LucideIcon;
  stats: Array<{
    label: string;
    value: string;
    growth: string;
  }>;
}

interface BusinessSlide extends SlideBase {
  type: "business";
  tiers: Array<{
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
  }>;
}

interface TractionSlide extends SlideBase {
  type: "traction";
  milestones: Array<{
    phase: string;
    title: string;
    target: string;
    timeline: string;
  }>;
}

interface NextSlide extends SlideBase {
  type: "next";
  actions: string[];
  contact: {
    email: string;
    demo: string;
  };
}

type Slide = TitleSlide | ProblemSlide | SolutionSlide | FeaturesSlide | DemoSlide | MarketSlide | BusinessSlide | TractionSlide | NextSlide;

const slides: Slide[] = [
  {
    id: 1,
    type: "title",
    title: "MindFlow",
    subtitle: "AI-Powered Mental Wellness Platform",
    content: "Transforming how people understand and improve their emotional health through intelligent journaling and mood analytics.",
    background: "from-indigo-600 to-purple-600"
  },
  {
    id: 2,
    type: "problem",
    title: "The Mental Health Crisis",
    subtitle: "A growing global challenge",
    content: [
      "1 in 4 people worldwide experience mental health issues",
      "Depression and anxiety have increased 25% since COVID-19",
      "Only 30% of people seek professional help due to cost and stigma",
      "Traditional therapy has 3-6 month waiting lists",
      "People lack accessible tools for daily emotional self-awareness"
    ],
    icon: Heart,
    background: "from-red-500 to-pink-600"
  },
  {
    id: 3,
    type: "solution",
    title: "Our Solution",
    subtitle: "AI-powered emotional intelligence",
    content: [
      "Instant AI analysis of journal entries using advanced NLP",
      "Real-time mood tracking with personalized insights",
      "Beautiful visualizations to identify emotional patterns",
      "Accessible 24/7 from any device",
      "Privacy-first approach with secure data handling"
    ],
    icon: Brain,
    background: "from-green-500 to-teal-600"
  },
  {
    id: 4,
    type: "features",
    title: "How MindFlow Works",
    subtitle: "Simple, powerful, intelligent",
    features: [
      {
        icon: Zap,
        title: "Smart Journaling",
        description: "Write freely while AI analyzes sentiment, emotion, and mood patterns in real-time"
      },
      {
        icon: BarChart3,
        title: "Mood Analytics",
        description: "Beautiful charts and insights help you understand your emotional trends over time"
      },
      {
        icon: Target,
        title: "Personalized Insights",
        description: "AI provides tailored recommendations for improving your mental wellness"
      },
      {
        icon: Shield,
        title: "Privacy First",
        description: "Your data is encrypted and never shared. Complete control over your personal information"
      }
    ],
    background: "from-blue-500 to-indigo-600"
  },
  {
    id: 5,
    type: "demo",
    title: "Live Demo",
    subtitle: "See MindFlow in action",
    content: "Experience the app at: xutmvobehyo2w.mocha.app",
    demoSteps: [
      "Sign up with Google in seconds",
      "Write your first journal entry",
      "Watch AI analyze your mood instantly",
      "Explore beautiful mood visualizations",
      "Track your emotional journey over time"
    ],
    background: "from-purple-500 to-indigo-600"
  },
  {
    id: 6,
    type: "market",
    title: "Market Opportunity",
    subtitle: "A $5.6B growing market",
    stats: [
      { label: "Mental Health App Market", value: "$5.6B", growth: "+23% CAGR" },
      { label: "Target Users (US)", value: "75M", growth: "Adults seeking wellness tools" },
      { label: "Average Revenue per User", value: "$60/year", growth: "Industry standard" },
      { label: "Market Penetration", value: "<5%", growth: "Huge untapped potential" }
    ],
    icon: TrendingUp,
    background: "from-emerald-500 to-green-600"
  },
  {
    id: 7,
    type: "business",
    title: "Business Model",
    subtitle: "Freemium with premium features",
    tiers: [
      {
        name: "Free",
        price: "$0",
        features: ["5 entries/month", "Basic mood tracking", "7-day history"]
      },
      {
        name: "Premium",
        price: "$4.99/mo",
        features: ["Unlimited entries", "Advanced AI insights", "Full analytics", "Data export"],
        popular: true
      },
      {
        name: "Enterprise",
        price: "$50/employee",
        features: ["Team analytics", "Corporate wellness", "Custom integrations"]
      }
    ],
    background: "from-orange-500 to-red-600"
  },
  {
    id: 8,
    type: "traction",
    title: "Growth Strategy",
    subtitle: "Path to 100K users",
    milestones: [
      { phase: "Phase 1", title: "Launch & Validation", target: "1K users", timeline: "Month 1-3" },
      { phase: "Phase 2", title: "Premium Features", target: "10K users", timeline: "Month 4-8" },
      { phase: "Phase 3", title: "Enterprise Sales", target: "50K users", timeline: "Month 9-18" },
      { phase: "Phase 4", title: "Scale & Exit", target: "100K+ users", timeline: "Month 19-36" }
    ],
    background: "from-violet-500 to-purple-600"
  },
  {
    id: 9,
    type: "next",
    title: "Next Steps",
    subtitle: "Ready to transform mental wellness",
    actions: [
      "Try the live demo at xutmvobehyo2w.mocha.app",
      "Join our beta program for early access to premium features",
      "Partner with us to bring MindFlow to your organization",
      "Invest in the future of mental health technology"
    ],
    contact: {
      email: "hello@mindflow.app",
      demo: "xutmvobehyo2w.mocha.app"
    },
    background: "from-indigo-600 to-purple-600"
  }
];

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
        nextSlide();
      } else if (e.key === "ArrowLeft" && currentSlide > 0) {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.background} opacity-90`}></div>
      
      {/* Navigation */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => window.history.back()}
          className="text-white/80 hover:text-white transition-colors"
        >
          ← Back to App
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-20">
        <span className="text-white/80">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl mx-auto w-full">
          
          {/* Title Slide */}
          {slide.type === "title" && (
            <div className="text-center">
              <div className="mb-8">
                <Brain className="w-24 h-24 mx-auto mb-6 text-white" />
              </div>
              <h1 className="text-7xl font-bold mb-6">{slide.title}</h1>
              <h2 className="text-3xl font-light mb-8 text-white/90">{slide.subtitle}</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">{slide.content}</p>
            </div>
          )}

          {/* Problem Slide */}
          {slide.type === "problem" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {(() => {
                  const IconComponent = (slide as ProblemSlide).icon;
                  return <IconComponent className="w-16 h-16 mb-6 text-white" />;
                })()}
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-2xl font-light mb-8 text-white/90">{slide.subtitle}</h2>
              </div>
              <div className="space-y-6">
                {(slide as ProblemSlide).content.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-white/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solution Slide */}
          {slide.type === "solution" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {(() => {
                  const IconComponent = (slide as SolutionSlide).icon;
                  return <IconComponent className="w-16 h-16 mb-6 text-white" />;
                })()}
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-2xl font-light mb-8 text-white/90">{slide.subtitle}</h2>
              </div>
              <div className="space-y-6">
                {(slide as SolutionSlide).content.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-lg text-white/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Slide */}
          {slide.type === "features" && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-2xl font-light text-white/90">{slide.subtitle}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {(slide as FeaturesSlide).features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                      <IconComponent className="w-12 h-12 mb-4 text-white" />
                      <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-white/80 text-lg">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Demo Slide */}
          {slide.type === "demo" && (
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
              <h2 className="text-2xl font-light mb-8 text-white/90">{slide.subtitle}</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <p className="text-2xl font-mono mb-6">{(slide as DemoSlide).content}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(slide as DemoSlide).demoSteps.map((step, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4">
                      <div className="w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold mb-3 mx-auto">
                        {index + 1}
                      </div>
                      <p className="text-white/90">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Market Slide */}
          {slide.type === "market" && (
            <div>
              <div className="text-center mb-12">
                {(() => {
                  const IconComponent = (slide as MarketSlide).icon;
                  return <IconComponent className="w-16 h-16 mx-auto mb-6 text-white" />;
                })()}
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-2xl font-light text-white/90">{slide.subtitle}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {(slide as MarketSlide).stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-xl mb-2">{stat.label}</div>
                    <div className="text-green-300 font-semibold">{stat.growth}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Business Model Slide */}
          {slide.type === "business" && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-2xl font-light text-white/90">{slide.subtitle}</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {(slide as BusinessSlide).tiers.map((tier, index) => (
                  <div key={index} className={`p-6 rounded-2xl backdrop-blur-sm ${tier.popular ? 'bg-white/20 border-2 border-white' : 'bg-white/10'}`}>
                    {tier.popular && (
                      <div className="text-center mb-4">
                        <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">POPULAR</span>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                      <div className="text-3xl font-bold">{tier.price}</div>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traction Slide */}
          {slide.type === "traction" && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
                <h2 className="text-2xl font-light text-white/90">{slide.subtitle}</h2>
              </div>
              <div className="space-y-6">
                {(slide as TractionSlide).milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-6 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl font-bold">{milestone.phase}</h3>
                        <span className="text-lg font-semibold text-green-300">{milestone.target}</span>
                      </div>
                      <div className="text-white/80">{milestone.title}</div>
                      <div className="text-white/60">{milestone.timeline}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps Slide */}
          {slide.type === "next" && (
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">{slide.title}</h1>
              <h2 className="text-2xl font-light mb-12 text-white/90">{slide.subtitle}</h2>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {(slide as NextSlide).actions.map((action, index) => (
                  <div key={index} className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 mx-auto">
                      {index + 1}
                    </div>
                    <p className="text-lg">{action}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
                <p className="text-xl mb-4">Demo: {(slide as NextSlide).contact.demo}</p>
                <p className="text-xl">Contact: {(slide as NextSlide).contact.email}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="p-3 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors"
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Keyboard Navigation */}
      <div className="absolute bottom-4 right-4 z-20 text-white/60 text-sm">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
}
