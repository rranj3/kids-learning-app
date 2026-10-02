'use client';

import { useState, useEffect } from 'react';
import { shuffleArray } from '@/lib/utils';

interface WordFamily {
  family: string;
  words: string[];
}

interface WordFamilyGameProps {
  ageBand: string;
  onComplete: (score: number) => void;
}

// Word families by age band
const FAMILIES: Record<string, WordFamily[]> = {
  'K-G2': [
    { family: 'at', words: ['cat', 'hat', 'bat', 'mat', 'rat'] },
    { family: 'og', words: ['dog', 'log', 'fog', 'hog', 'bog'] },
    { family: 'an', words: ['can', 'man', 'pan', 'tan', 'van'] },
    { family: 'en', words: ['pen', 'hen', 'ten', 'men', 'den'] },
  ],
  'G3-G4': [
    { family: 'ight', words: ['light', 'sight', 'night', 'fight', 'right'] },
    { family: 'ake', words: ['cake', 'lake', 'make', 'take', 'wake'] },
    { family: 'all', words: ['ball', 'call', 'fall', 'hall', 'small'] },
    { family: 'ing', words: ['sing', 'ring', 'wing', 'king', 'thing'] },
  ],
};

export default function WordFamilyGame({
  ageBand,
  onComplete,
}: WordFamilyGameProps) {
  const [families, setFamilies] = useState<WordFamily[]>([]);
  const [currentFamilyIdx, setCurrentFamilyIdx] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  function initializeGame() {
    const gameFamilies = FAMILIES[ageBand] || FAMILIES['K-G2'];
    setFamilies(gameFamilies);
    loadNewFamily(gameFamilies, 0);
    setIsLoading(false);
  }

  function loadNewFamily(gameFamilies: WordFamily[], idx: number) {
    const currentFamily = gameFamilies[idx];
    // Mix correct words with words from other families
    const incorrectWords = gameFamilies
      .filter((_, i) => i !== idx)
      .flatMap((f) => f.words)
      .slice(0, 2);

    const allWords = shuffleArray([...currentFamily.words, ...incorrectWords]);
    setWords(allWords);
    setSelectedWords(new Set());
    setFeedback(null);
  }

  function handleWordClick(word: string) {
    const newSelected = new Set(selectedWords);
    if (newSelected.has(word)) {
      newSelected.delete(word);
    } else {
      newSelected.add(word);
    }
    setSelectedWords(newSelected);
  }

  function handleSubmit() {
    const currentFamily = families[currentFamilyIdx];
    const isCorrect =
      selectedWords.size === currentFamily.words.length &&
      currentFamily.words.every((w) => selectedWords.has(w));

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount(correctCount + 1);

      if (currentFamilyIdx < families.length - 1) {
        setTimeout(() => {
          setCurrentFamilyIdx(currentFamilyIdx + 1);
          loadNewFamily(families, currentFamilyIdx + 1);
        }, 1500);
      } else {
        // Game complete
        setTimeout(() => {
          const finalScore = Math.round(
            ((correctCount + 1) / families.length) * 100
          );
          onComplete(finalScore);
        }, 1500);
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  if (isLoading || families.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-lg font-semibold text-gray-700">Loading game...</p>
        </div>
      </div>
    );
  }

  const currentFamily = families[currentFamilyIdx];
  const progressPercent = ((currentFamilyIdx + 1) / families.length) * 100;
  const isComplete = selectedWords.size > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-yellow-800 mb-4">
          📚 Word Families
        </h1>

        {/* Progress */}
        <div className="mb-8 text-center">
          <div className="inline-block px-6 py-2 bg-white rounded-full shadow-md">
            <p className="text-lg font-bold text-yellow-700">
              Score: {correctCount} / {families.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-yellow-200 rounded-full h-3 mb-8 overflow-hidden">
          <div
            className="bg-yellow-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Game card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-center text-gray-700 text-lg mb-2">
            Select all words in the
          </p>
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-3 bg-orange-100 rounded-lg border-4 border-orange-400">
              <div className="text-4xl font-bold text-orange-600">
                -{currentFamily.family}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm mb-6">
            (Click to select, then click Submit)
          </p>

          {/* Word buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {words.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handleWordClick(word)}
                className={`p-4 rounded-lg text-xl font-bold transition-all transform ${
                  selectedWords.has(word)
                    ? 'bg-orange-400 text-white scale-105 shadow-lg'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {word}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`text-center text-2xl font-bold mb-6 ${
              feedback === 'correct' ? 'text-green-600' : 'text-red-600'
            }`}>
              {feedback === 'correct' ? '✅ Correct!' : '❌ Try again!'}
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!isComplete || feedback !== null}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors"
          >
            ✓ Check Answer
          </button>
        </div>
      </div>
    </div>
  );
}
