import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import type { CreateJournalEntryRequest } from "@/shared/types";

interface JournalEntryFormProps {
  onSubmit: (entry: CreateJournalEntryRequest) => Promise<void>;
  isLoading?: boolean;
}

export default function JournalEntryForm({ onSubmit, isLoading = false }: JournalEntryFormProps) {
  const [entryText, setEntryText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryText.trim() || isLoading) return;

    await onSubmit({ entry_text: entryText.trim() });
    setEntryText("");
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        How are you feeling today?
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <textarea
            value={entryText}
            onChange={(e) => setEntryText(e.target.value)}
            placeholder="Share your thoughts, feelings, and experiences..."
            className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-white/50 backdrop-blur-sm placeholder-gray-400"
            disabled={isLoading}
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              {entryText.length}/2000 characters
            </span>
            <span className="text-xs text-gray-400">
              AI will analyze your mood automatically
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!entryText.trim() || isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing mood...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Save Entry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
