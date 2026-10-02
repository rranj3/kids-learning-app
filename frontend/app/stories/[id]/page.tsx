'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Story } from '@/lib/types';
import { apiClient } from '@/lib/api';
import StoryReader from '@/components/StoryReader';
import { storage } from '@/lib/utils';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const childId = storage.getChildId();

  useEffect(() => {
    if (!childId) {
      router.push('/');
      return;
    }
    loadStory();
  }, [storyId]);

  async function loadStory() {
    try {
      setIsLoading(true);
      const data = await apiClient.getStory(storyId);
      setStory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load story');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600 text-lg font-semibold">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-600 mb-4">{error || 'Story not found'}</p>
          <Link
            href="/stories"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
          >
            ← Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <StoryReader
        story={story}
        onComplete={() => router.push(`/quizzes/${storyId}`)}
        showQuizButton={true}
      />
    </>
  );
}
