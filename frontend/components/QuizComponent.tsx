'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';
import { shuffleArray } from '@/lib/utils';

interface QuizComponentProps {
  questions: Question[];
  onComplete: (score: number, answers: Record<string, string>) => void;
}

export default function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === questions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const handleConfirm = () => {
    if (!selectedAnswer) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: selectedAnswer,
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calculate score
      const score = calculateScore(questions, newAnswers);
      onComplete(score, newAnswers);
    } else {
      // Move to next question
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      const score = calculateScore(questions, answers);
      onComplete(score, answers);
    } else {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correct_answer;
  const progressPercent = ((currentQuestionIdx + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-purple-700">
              Question {currentQuestionIdx + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-purple-700">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-800 mb-8">
            {currentQuestion.prompt}
          </h2>

          {/* Multiple choice options */}
          {currentQuestion.answer_type === 'multiple_choice' && (
            <div className="space-y-4">
              {currentQuestion.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-lg font-semibold rounded-lg transition-all text-left ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'bg-green-200 border-4 border-green-600 text-green-900'
                        : 'bg-red-200 border-4 border-red-600 text-red-900'
                      : 'bg-gray-100 border-4 border-gray-300 text-gray-800 hover:bg-gray-200'
                  } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="inline-block w-8 h-8 rounded-full bg-purple-500 text-white mr-3 text-center font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Fill in the blank */}
          {currentQuestion.answer_type === 'fill_blank' && (
            <input
              type="text"
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={isAnswered}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 text-lg border-4 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 disabled:bg-gray-100"
              onKeyPress={(e) => e.key === 'Enter' && !isAnswered && handleConfirm()}
            />
          )}

          {/* Feedback */}
          {showFeedback && selectedAnswer && (
            <div className={`mt-8 p-6 rounded-lg border-l-4 ${
              isCorrect
                ? 'bg-green-50 border-green-600'
                : 'bg-yellow-50 border-yellow-600'
            }`}>
              <p className={`text-lg font-bold mb-2 ${
                isCorrect ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {isCorrect ? '✅ Awesome!' : '💡 Good try!'}
              </p>
              <p className="text-gray-800">{currentQuestion.explanation}</p>
              {!isCorrect && currentQuestion.correct_answer && (
                <p className="mt-2 text-gray-800">
                  <span className="font-semibold">Correct answer:</span> {currentQuestion.correct_answer}
                </p>
              )}
            </div>
          )}

          {/* Hint */}
          {!isAnswered && currentQuestion.hint && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
              <p className="text-sm text-blue-700">
                <span className="font-bold">💭 Hint:</span> {currentQuestion.hint}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          {!isAnswered ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
              >
                ⏭️ Skip
              </button>
              {(selectedAnswer || currentQuestion.answer_type === 'fill_blank') && (
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
                >
                  ✓ Next
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleConfirm}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {isLastQuestion ? '🎉 See Results' : '→ Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function calculateScore(questions: Question[], answers: Record<string, string>): number {
  let correct = 0;
  questions.forEach((q) => {
    if (answers[q.id] === q.correct_answer) {
      correct++;
    }
  });
  return Math.round((correct / questions.length) * 100);
}
