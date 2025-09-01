import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { JournalEntry } from "@/shared/types";

interface MoodChartProps {
  entries: JournalEntry[];
}

export default function MoodChart({ entries }: MoodChartProps) {
  // Process data for the chart
  const chartData = entries
    .filter(entry => entry.mood_score !== null)
    .slice(-30) // Last 30 entries
    .map(entry => ({
      date: new Date(entry.created_at).toLocaleDateString(),
      mood: entry.mood_score!,
      emotion: entry.primary_emotion,
    }))
    .reverse(); // Show oldest to newest

  const averageMood = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, entry) => sum + entry.mood, 0) / chartData.length)
    : 50;

  const getMoodColor = (score: number) => {
    if (score >= 70) return "#10b981"; // green
    if (score >= 40) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const getMoodLabel = (score: number) => {
    if (score >= 70) return "Great";
    if (score >= 40) return "Okay";
    return "Difficult";
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Mood Trends</h3>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: getMoodColor(averageMood) }}>
            {averageMood}
          </div>
          <div className="text-sm text-gray-500">
            Average ({getMoodLabel(averageMood)})
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>Start journaling to see your mood trends!</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number) => [
                  `${value} (${getMoodLabel(value)})`,
                  'Mood Score'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
