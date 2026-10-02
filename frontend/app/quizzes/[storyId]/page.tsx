'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Quiz } from '@/lib/types';
import { apiClient } from '@/lib/api';
import QuizComponent from '@/components/QuizComponent';
import { storage, formatScore } from '@/lib/utils';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.storyId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const childId = storage.getChildId();

  useEffect(() => {
    if (!childId) {
      router.push('/');
      return;
    }
    loadQuiz();
  }, [storyId]);

  async function loadQuiz() {
    try {
      setIsLoading(true);
      const data = await apiClient.getQuiz(storyId);
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuizComplete(quizScore: number, answers: Record<string, string>) {
    try {
      setIsSubmitting(true);
      setScore(quizScore);

      if (childId && quiz) {
        // Record progress
        await apiClient.recordProgress(childId, storyId, quizScore, 300); // 5 minutes default
      }

      // Show results after a moment
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to record progress:', err);
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 text-lg font-semibold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-600 mb-4">{error || 'Quiz not found'}</p>
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

  if (score !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-2xl">
          <div className="text-6xl mb-6">
            {score >= 80 ? '🎉' : score >= 60 ? '👏' : '💪'}
          </div>

          <h1 className="text-4xl font-bold text-purple-700 mb-4">Quiz Complete!</h1>

          <div className="bg-purple-100 rounded-lg p-8 mb-8">
            <div className="text-6xl font-bold text-purple-700 mb-2">
              {formatScore(score)}
            </div>
            <p className="text-lg text-purple-600">
              {score >= 80 && "Excellent work! 🌟"}
              {score >= 60 && score < 80 && "Great effort! Keep practicing! 📚"}
              {score < 60 && "Good try! Review and try again! 💪"}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/stories')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              📚 Next Story
            </button>
            <button
              onClick={() => router.push('/games')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              🎮 Try a Game
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              ← Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QuizComponent
      questions={quiz.questions}
      onComplete={handleQuizComplete}
    />
  );
}
