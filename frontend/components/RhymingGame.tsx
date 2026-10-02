'use client';

import { useState, useEffect } from 'react';
import { shuffleArray, delay } from '@/lib/utils';

interface RhymePair {
  word: string;
  rhyme: string;
  emoji?: string;
}

interface RhymingGameProps {
  ageBand: string;
  onComplete: (score: number) => void;
}

// Sample rhymes by age band
const RHYME_SETS: Record<string, RhymePair[]> = {
  '2yo': [
    { word: 'cat', rhyme: 'hat', emoji: '🐱' },
    { word: 'dog', rhyme: 'log', emoji: '🐶' },
    { word: 'bat', rhyme: 'rat', emoji: '🦇' },
  ],
  '3yo': [
    { word: 'cat', rhyme: 'hat', emoji: '🐱' },
    { word: 'dog', rhyme: 'log', emoji: '🐶' },
    { word: 'bat', rhyme: 'rat', emoji: '🦇' },
    { word: 'bed', rhyme: 'red', emoji: '🛏️' },
    { word: 'sun', rhyme: 'run', emoji: '☀️' },
  ],
  'K-G2': [
    { word: 'cat', rhyme: 'hat', emoji: '🐱' },
    { word: 'tree', rhyme: 'bee', emoji: '🌳' },
    { word: 'king', rhyme: 'ring', emoji: '👑' },
    { word: 'book', rhyme: 'cook', emoji: '📖' },
    { word: 'mouse', rhyme: 'house', emoji: '🐭' },
    { word: 'day', rhyme: 'play', emoji: '☀️' },
  ],
};

export default function RhymingGame({
  ageBand,
  onComplete,
}: RhymingGameProps) {
  const [pairs, setPairs] = useState<RhymePair[]>([]);
  const [currentPairIdx, setCurrentPairIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  async function initializeGame() {
    const gamePairs = RHYME_SETS[ageBand] || RHYME_SETS['K-G2'];
    const shuffled = shuffleArray(gamePairs);
    setPairs(shuffled);
    generateOptions(shuffled, 0);
    setIsLoading(false);
  }

  function generateOptions(gamePairs: RhymePair[], pairIdx: number) {
    const currentPair = gamePairs[pairIdx];
    const wrongPairs = gamePairs.filter((_, idx) => idx !== pairIdx);
    const wrongAnswers = shuffleArray(wrongPairs)
      .slice(0, 2)
      .map((p) => p.rhyme);

    const allOptions = shuffleArray([currentPair.rhyme, ...wrongAnswers]);
    setOptions(allOptions);
  }

  async function handleAnswer(answer: string) {
    const isRhyming = answer === pairs[currentPairIdx].rhyme;
    setIsCorrect(isRhyming);
    setSelectedAnswer(answer);
    setAnswered(true);

    if (isRhyming) {
      setScore(score + 1);
    }

    await delay(1500);

    if (currentPairIdx < pairs.length - 1) {
      setCurrentPairIdx(currentPairIdx + 1);
      generateOptions(pairs, currentPairIdx + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      const finalScore = isRhyming
        ? Math.round(((score + 1) / pairs.length) * 100)
        : Math.round((score / pairs.length) * 100);
      onComplete(finalScore);
    }
  }

  if (isLoading || pairs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        <div className="text-center">
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-lg font-semibold text-gray-700">Loading game...</p>
        </div>
      </div>
    );
  }

  const currentPair = pairs[currentPairIdx];
  const progressPercent = ((currentPairIdx + 1) / pairs.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-green-700 mb-4">
          🎵 Rhyming Game
        </h1>

        {/* Progress */}
        <div className="mb-8 text-center">
          <div className="inline-block px-6 py-2 bg-white rounded-full shadow-md">
            <p className="text-lg font-bold text-green-700">
              Score: {score} / {pairs.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-green-200 rounded-full h-3 mb-8 overflow-hidden">
          <div
            className="bg-green-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Game card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <p className="text-gray-600 text-lg mb-6">Find the word that rhymes with:</p>

          <div className="mb-8">
            <div className="text-6xl mb-2">{currentPair.emoji || '🎯'}</div>
            <div className="text-5xl font-bold text-green-700">{currentPair.word}</div>
          </div>

          {/* Answer options */}
          <div className="space-y-4">
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !answered && handleAnswer(option)}
                disabled={answered}
                className={`w-full p-4 text-2xl font-bold rounded-lg transition-all transform hover:scale-105 ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-400 text-white scale-105'
                      : 'bg-red-400 text-white scale-105'
                    : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`mt-6 text-2xl font-bold ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {isCorrect ? '✅ Correct! They rhyme!' : '❌ Not quite!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
