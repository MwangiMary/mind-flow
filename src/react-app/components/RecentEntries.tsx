import { Calendar, Heart, MessageCircle } from "lucide-react";
import type { JournalEntry } from "@/shared/types";

interface RecentEntriesProps {
  entries: JournalEntry[];
}

export default function RecentEntries({ entries }: RecentEntriesProps) {
  const getEmotionIcon = (emotion: string | null) => {
    switch (emotion) {
      case "happy":
        return "😊";
      case "sad":
        return "😢";
      case "angry":
        return "😠";
      case "anxious":
        return "😰";
      case "excited":
        return "🤩";
      default:
        return "😐";
    }
  };

  const getMoodColor = (score: number | null) => {
    if (!score) return "bg-gray-500";
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Recent Entries
      </h3>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No journal entries yet. Start writing to track your mood!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {entries.slice(0, 10).map((entry) => (
            <div
              key={entry.id}
              className="p-4 bg-white/50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getEmotionIcon(entry.primary_emotion)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood_score)}`}
                      ></div>
                      <span className="font-medium text-gray-800">
                        {entry.mood_score ? `${entry.mood_score}/100` : "No score"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(entry.created_at)}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm line-clamp-3 mb-2">
                {entry.entry_text}
              </p>
              
              {entry.ai_analysis && (
                <div className="mt-2 p-2 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-700">
                    <Heart className="w-3 h-3 inline mr-1" />
                    {entry.ai_analysis}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
