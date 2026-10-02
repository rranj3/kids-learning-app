'use client';

import { useState, useEffect } from 'react';
import { Story } from '@/lib/types';
import { apiClient } from '@/lib/api';
import { formatDuration } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface StoryReaderProps {
  story: Story;
  onComplete?: (score: number) => void;
  showQuizButton?: boolean;
}

export default function StoryReader({
  story,
  onComplete,
  showQuizButton = true,
}: StoryReaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Track time on page
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      console.log(`Time spent on story: ${timeSpent} seconds`);
    };
  }, [startTime]);

  const handleQuizStart = () => {
    if (showQuizButton) {
      setIsLoading(true);
      // Quiz will be handled by parent component or next page
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Story Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2">
            {story.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
              📖 {story.word_count} words
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
              ⏱️ {formatDuration(story.estimated_duration_minutes)}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
              Level {story.difficulty_level}/5
            </span>
          </div>
        </div>

        {/* Story Illustrations */}
        {story.illustration_urls && story.illustration_urls.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.illustration_urls.map((url, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={url}
                  alt={`Illustration ${idx + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Story Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-amber-900 mt-6 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-amber-800 mt-5 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-amber-700 mt-4 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 text-lg leading-relaxed">{children}</p>
                ),
                li: ({ children }) => (
                  <li className="mb-2 ml-6 list-disc">{children}</li>
                ),
              }}
            >
              {story.body_markdown}
            </ReactMarkdown>
          </div>

          {/* Vocabulary Section */}
          {story.vocabulary_list && story.vocabulary_list.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-4">📚 New Words</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {story.vocabulary_list.map((word, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 text-center font-semibold text-amber-800"
                  >
                    {word}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 flex-col md:flex-row">
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
          >
            ← Back to Stories
          </button>
          {showQuizButton && (
            <button
              onClick={handleQuizStart}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {isLoading ? '⏳ Loading...' : '🎯 Take the Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
