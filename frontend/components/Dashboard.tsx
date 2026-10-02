'use client';

import { useState, useEffect } from 'react';
import { Child, ProgressRecord } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';

interface DashboardProps {
  child: Child;
}

export default function Dashboard({ child }: DashboardProps) {
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActivities: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    streak: 0,
  });

  useEffect(() => {
    loadProgress();
  }, [child.id]);

  async function loadProgress() {
    try {
      setIsLoading(true);
      const data = await apiClient.getProgress(child.id);
      const records = data.records || [];
      setProgress(records);

      // Calculate stats
      if (records.length > 0) {
        const avgScore = Math.round(
          records.reduce((sum: number, r: ProgressRecord) => sum + r.score, 0) / records.length
        );
        const totalTime = records.reduce((sum: number, r: ProgressRecord) => sum + r.time_spent_seconds, 0);

        setStats({
          totalActivities: records.length,
          averageScore: avgScore,
          totalTimeSpent: totalTime,
          streak: calculateStreak(records),
        });
      }
    } catch (err) {
      console.error('Failed to load progress:', err);
    } finally {
      setIsLoading(false);
    }
  }

  function calculateStreak(records: ProgressRecord[]): number {
    if (records.length === 0) return 0;

    const sorted = [...records].sort(
      (a, b) => new Date(b.completed_at || b.created_at).getTime() -
                 new Date(a.completed_at || a.created_at).getTime()
    );

    let streak = 0;
    let currentDate = new Date();

    for (const record of sorted) {
      const recordDate = new Date(record.completed_at || record.created_at);
      const dayDiff = Math.floor(
        (currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-300 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-teal-600 text-lg font-semibold">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-2">
            📊 {child.name}'s Progress
          </h1>
          <p className="text-lg text-teal-600">Parent Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <StatCard
            label="Activities Completed"
            value={stats.totalActivities}
            icon="🎯"
          />
          <StatCard
            label="Average Score"
            value={`${stats.averageScore}%`}
            icon="⭐"
          />
          <StatCard
            label="Total Time"
            value={formatTime(stats.totalTimeSpent)}
            icon="⏱️"
          />
          <StatCard
            label="Current Streak"
            value={`${stats.streak} days`}
            icon="🔥"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-teal-700 mb-6">📝 Recent Activity</h2>

          {progress.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No activities yet. Start learning now! 🚀
            </p>
          ) : (
            <div className="space-y-4">
              {progress.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="p-4 border-2 border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-lg text-teal-700">
                      {record.content_type === 'story' && '📖 Story'}
                      {record.content_type === 'quiz' && '🎯 Quiz'}
                      {record.content_type === 'game' && '🎮 Game'}
                      {record.content_type === 'grammar_lesson' && '📝 Grammar'}
                      {record.content_type === 'math_problem' && '🔢 Math'}
                    </span>
                    <span className={`text-lg font-bold px-3 py-1 rounded-full ${
                      record.score >= 80
                        ? 'bg-green-100 text-green-800'
                        : record.score >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.score}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>⏱️ {formatTime(record.time_spent_seconds)}</span>
                    <span>📅 {formatDate(record.created_at)}</span>
                  </div>
                  {record.ai_feedback && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                      💡 {record.ai_feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold text-teal-700 mb-2">{value}</div>
      <p className="text-gray-600 font-semibold">{label}</p>
    </div>
  );
}
