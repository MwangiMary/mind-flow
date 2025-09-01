import { useState, useEffect } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";
import { LogOut, Plus, Share2, Presentation } from "lucide-react";
import JournalEntryForm from "@/react-app/components/JournalEntryForm";
import MoodChart from "@/react-app/components/MoodChart";
import RecentEntries from "@/react-app/components/RecentEntries";
import ShareApp from "@/react-app/components/ShareApp";
import type { JournalEntry, CreateJournalEntryRequest } from "@/shared/types";

export default function Dashboard() {
  const { user, isPending, logout } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!user && !isPending) {
      navigate("/");
      return;
    }
    
    if (user) {
      fetchEntries();
    }
  }, [user, isPending, navigate]);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/journal-entries", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    }
  };

  const handleSubmitEntry = async (entryData: CreateJournalEntryRequest) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/journal-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(entryData),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries([newEntry, ...entries]);
        setShowForm(false);
      } else {
        console.error("Failed to create entry");
      }
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MindFlow
              </h1>
              <p className="text-gray-600">
                Welcome back, {user.google_user_data.given_name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/pitch"
                className="bg-white/70 backdrop-blur-sm text-purple-600 px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 border border-purple-200"
              >
                <Presentation className="w-4 h-4" />
                Pitch Deck
              </a>
              <button
                onClick={() => setShowShare(true)}
                className="bg-white/70 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 border border-indigo-200"
              >
                <Share2 className="w-4 h-4" />
                Share App
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {showForm ? "Cancel" : "New Entry"}
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Journal Entry Form */}
          {showForm && (
            <div className="lg:col-span-3">
              <JournalEntryForm onSubmit={handleSubmitEntry} isLoading={isLoading} />
            </div>
          )}

          {/* Mood Chart */}
          <div className="lg:col-span-2">
            <MoodChart entries={entries} />
          </div>

          {/* Recent Entries */}
          <div className="lg:col-span-1">
            <RecentEntries entries={entries} />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareApp isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
