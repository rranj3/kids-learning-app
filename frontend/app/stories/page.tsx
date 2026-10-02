'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Story, AgeBand } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { storage, AGE_BANDS, formatDuration, getDifficultyColor } from '@/lib/utils';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgeBand, setSelectedAgeBand] = useState<AgeBand | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'ELA' | 'MATH'>('all');
  const router = useRouter();

  const childId = storage.getChildId();

  useEffect(() => {
    if (!childId) {
      router.push('/');
      return;
    }
    loadStories();
  }, []);

  async function loadStories() {
    try {
      setIsLoading(true);
      const data = await apiClient.getStories();
      setStories(data.stories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredStories = stories.filter((story) => {
    if (selectedAgeBand !== 'all' && story.age_band !== selectedAgeBand) return false;
    if (selectedSubject !== 'all' && story.subject !== selectedSubject) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 text-lg font-semibold">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">📚 Stories & Lessons</h1>
          <Link
            href="/games"
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg transition-colors"
          >
            🎮 Play Games
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Age band filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age Group
              </label>
              <select
                value={selectedAgeBand}
                onChange={(e) => setSelectedAgeBand(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-600"
              >
                <option value="all">All Age Groups</option>
                {Object.entries(AGE_BANDS).map(([band, info]) => (
                  <option key={band} value={band}>
                    {info.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-600"
              >
                <option value="all">All Subjects</option>
                <option value="ELA">📖 ELA (Reading)</option>
                <option value="MATH">🔢 Math</option>
              </select>
            </div>

            {/* Home button */}
            <div className="flex items-end">
              <Link
                href="/"
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg text-center transition-colors"
              >
                ← Change Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stories grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600">No stories found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 overflow-hidden cursor-pointer"
              >
                {/* Subject badge */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl font-bold text-indigo-700 mb-2 group-hover:text-indigo-900">
                    {story.title}
                  </h2>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                      {story.subject === 'ELA' ? '📖' : '🔢'} {story.subject}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getDifficultyColor(
                      story.difficulty_level
                    )}`}>
                      Level {story.difficulty_level}/5
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📖 {story.word_count} words</p>
                    <p>⏱️ {formatDuration(story.estimated_duration_minutes)}</p>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 inline-block text-indigo-600 font-semibold group-hover:text-indigo-900 flex items-center">
                    Read Story →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
