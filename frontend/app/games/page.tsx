'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storage } from '@/lib/utils';
import RhymingGame from '@/components/RhymingGame';
import WordFamilyGame from '@/components/WordFamilyGame';
import GrammarExercise from '@/components/GrammarExercise';

type GameType = null | 'rhyming' | 'word-family' | 'grammar';

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const router = useRouter();

  const childId = storage.getChildId();
  const ageBand = 'K-G2'; // In production, get from child profile

  if (!childId) {
    router.push('/');
    return null;
  }

  if (selectedGame === 'rhyming') {
    return (
      <RhymingGame
        ageBand={ageBand}
        onComplete={(score) => {
          setGameScore(score);
          setGameComplete(true);
        }}
      />
    );
  }

  if (selectedGame === 'word-family') {
    return (
      <WordFamilyGame
        ageBand={ageBand}
        onComplete={(score) => {
          setGameScore(score);
          setGameComplete(true);
        }}
      />
    );
  }

  if (selectedGame === 'grammar') {
    return (
      <GrammarExercise
        ageBand={ageBand}
        onComplete={(score) => {
          setGameScore(score);
          setGameComplete(true);
        }}
      />
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-2xl">
          <div className="text-6xl mb-6">🎮</div>

          <h1 className="text-4xl font-bold text-indigo-700 mb-4">Game Complete!</h1>

          <div className="bg-indigo-100 rounded-lg p-8 mb-8">
            <div className="text-6xl font-bold text-indigo-700 mb-2">
              {Math.round(gameScore)}%
            </div>
            <p className="text-lg text-indigo-600">
              {gameScore >= 80 && "Fantastic! You're a star! 🌟"}
              {gameScore >= 60 && gameScore < 80 && "Nice work! Keep it up! 🚀"}
              {gameScore < 60 && "Good effort! Play again to improve! 💪"}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setGameComplete(false)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              🎮 Play Another Game
            </button>
            <Link
              href="/stories"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              📚 Read a Story
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">🎮 Word Games & Grammar</h1>
          <Link
            href="/stories"
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors"
          >
            📚 Stories
          </Link>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Rhyming Game */}
          <button
            onClick={() => setSelectedGame('rhyming')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 p-8 text-left cursor-pointer"
          >
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-indigo-700 mb-3 group-hover:text-indigo-900">
              Rhyming Game
            </h2>
            <p className="text-gray-600 mb-4">
              Find words that rhyme! Improve your phonemic awareness and listening skills.
            </p>
            <div className="text-indigo-600 font-semibold flex items-center">
              Play Game →
            </div>
          </button>

          {/* Word Families */}
          <button
            onClick={() => setSelectedGame('word-family')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 p-8 text-left cursor-pointer"
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-indigo-700 mb-3 group-hover:text-indigo-900">
              Word Families
            </h2>
            <p className="text-gray-600 mb-4">
              Sort and group words by their word families. Build pattern recognition skills.
            </p>
            <div className="text-indigo-600 font-semibold flex items-center">
              Play Game →
            </div>
          </button>

          {/* Grammar Exercise */}
          <button
            onClick={() => setSelectedGame('grammar')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 p-8 text-left cursor-pointer"
          >
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-indigo-700 mb-3 group-hover:text-indigo-900">
              Parts of Speech
            </h2>
            <p className="text-gray-600 mb-4">
              Identify nouns, verbs, and adjectives. Master grammar foundations.
            </p>
            <div className="text-indigo-600 font-semibold flex items-center">
              Play Game →
            </div>
          </button>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">🚀 Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>🎯 Math Games - Addition & Subtraction</div>
            <div>💰 Money Counting Game</div>
            <div>⏰ Time-Telling Exercise</div>
            <div>🔢 Number Sequencing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
