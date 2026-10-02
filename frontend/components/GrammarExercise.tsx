'use client';

import { useState, useEffect } from 'react';
import { shuffleArray, delay } from '@/lib/utils';

interface GrammarItem {
  sentence: string;
  word: string;
  correctType: 'noun' | 'verb' | 'adjective';
  explanation: string;
}

interface GrammarExerciseProps {
  ageBand: string;
  onComplete: (score: number) => void;
}

// Grammar exercises by age band
const EXERCISES: Record<string, GrammarItem[]> = {
  'G2-G3': [
    {
      sentence: 'The cat sits on the mat.',
      word: 'cat',
      correctType: 'noun',
      explanation: 'A noun is a person, place, or thing. "Cat" is an animal (thing).',
    },
    {
      sentence: 'The cat sits on the mat.',
      word: 'sits',
      correctType: 'verb',
      explanation: 'A verb is an action word. "Sits" is what the cat does.',
    },
    {
      sentence: 'She has a red ball.',
      word: 'red',
      correctType: 'adjective',
      explanation: 'An adjective describes a noun. "Red" describes what the ball looks like.',
    },
    {
      sentence: 'The dog runs quickly.',
      word: 'dog',
      correctType: 'noun',
      explanation: 'A noun is a person, place, or thing. "Dog" is an animal.',
    },
    {
      sentence: 'The dog runs quickly.',
      word: 'runs',
      correctType: 'verb',
      explanation: 'A verb is an action word. "Runs" is what the dog does.',
    },
  ],
  'G3-G4': [
    {
      sentence: 'The happy children played outside.',
      word: 'children',
      correctType: 'noun',
      explanation: 'A noun names a person, place, or thing. "Children" are people.',
    },
    {
      sentence: 'The happy children played outside.',
      word: 'played',
      correctType: 'verb',
      explanation: 'A verb expresses an action. "Played" is what the children did.',
    },
    {
      sentence: 'The happy children played outside.',
      word: 'happy',
      correctType: 'adjective',
      explanation: 'An adjective modifies a noun. "Happy" describes how the children are.',
    },
    {
      sentence: 'She quickly wrote a beautiful letter.',
      word: 'letter',
      correctType: 'noun',
      explanation: 'A noun is a person, place, or thing. A "letter" is a written thing.',
    },
    {
      sentence: 'She quickly wrote a beautiful letter.',
      word: 'wrote',
      correctType: 'verb',
      explanation: 'A verb is an action word. "Wrote" is what she did.',
    },
    {
      sentence: 'She quickly wrote a beautiful letter.',
      word: 'beautiful',
      correctType: 'adjective',
      explanation: 'An adjective describes a noun. "Beautiful" describes the letter.',
    },
  ],
};

export default function GrammarExercise({
  ageBand,
  onComplete,
}: GrammarExerciseProps) {
  const [exercises, setExercises] = useState<GrammarItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeExercise();
  }, []);

  function initializeExercise() {
    const gameExercises = EXERCISES[ageBand] || EXERCISES['G3-G4'];
    const shuffled = shuffleArray(gameExercises);
    setExercises(shuffled);
    setIsLoading(false);
  }

  async function handleAnswer(type: 'noun' | 'verb' | 'adjective') {
    const isCorrectAnswer = type === exercises[currentIdx].correctType;
    setIsCorrect(isCorrectAnswer);
    setSelectedType(type);
    setAnswered(true);

    if (isCorrectAnswer) {
      setScore(score + 1);
    }

    await delay(2000);

    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setAnswered(false);
      setSelectedType(null);
    } else {
      const finalScore = isCorrectAnswer
        ? Math.round(((score + 1) / exercises.length) * 100)
        : Math.round((score / exercises.length) * 100);
      onComplete(finalScore);
    }
  }

  if (isLoading || exercises.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-lg font-semibold text-gray-700">Loading exercise...</p>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIdx];
  const progressPercent = ((currentIdx + 1) / exercises.length) * 100;

  // Highlight the target word in the sentence
  const parts = currentExercise.sentence.split(
    new RegExp(`(${currentExercise.word})`, 'gi')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-red-700 mb-4">
          📝 Parts of Speech
        </h1>

        {/* Progress */}
        <div className="mb-8 text-center">
          <div className="inline-block px-6 py-2 bg-white rounded-full shadow-md">
            <p className="text-lg font-bold text-red-700">
              Score: {score} / {exercises.length}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-red-200 rounded-full h-3 mb-8 overflow-hidden">
          <div
            className="bg-red-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Exercise card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Sentence */}
          <div className="mb-8 p-6 bg-gray-100 rounded-lg border-4 border-gray-300">
            <p className="text-2xl leading-relaxed text-gray-800">
              {parts.map((part, idx) => (
                part.toLowerCase() === currentExercise.word.toLowerCase() ? (
                  <span
                    key={idx}
                    className="font-bold text-red-600 bg-yellow-200 px-1 rounded"
                  >
                    {part}
                  </span>
                ) : (
                  <span key={idx}>{part}</span>
                )
              ))}
            </p>
          </div>

          {/* Question */}
          <p className="text-center text-lg font-semibold text-gray-700 mb-8">
            What is the highlighted word?
          </p>

          {/* Answer options */}
          <div className="space-y-4 mb-8">
            {['noun', 'verb', 'adjective'].map((type) => (
              <button
                key={type}
                onClick={() => !answered && handleAnswer(type as any)}
                disabled={answered}
                className={`w-full p-4 text-xl font-bold rounded-lg transition-all uppercase ${
                  selectedType === type
                    ? isCorrect
                      ? 'bg-green-400 text-white scale-105'
                      : 'bg-red-400 text-white scale-105'
                    : 'bg-blue-200 text-blue-900 hover:bg-blue-300'
                } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {answered && (
            <div className={`p-6 rounded-lg border-l-4 ${
              isCorrect
                ? 'bg-green-50 border-green-600'
                : 'bg-yellow-50 border-yellow-600'
            }`}>
              <p className={`text-lg font-bold mb-2 ${
                isCorrect ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isCorrect ? '✅ Correct!' : '💡 The answer is: ' + currentExercise.correctType.toUpperCase()}
              </p>
              <p className="text-gray-800">{currentExercise.explanation}</p>
            </div>
          )}
        </div>

        {answered && (
          <div className="text-center">
            <button
              onClick={() => {
                if (currentIdx < exercises.length - 1) {
                  setCurrentIdx(currentIdx + 1);
                  setAnswered(false);
                  setSelectedType(null);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              → Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
