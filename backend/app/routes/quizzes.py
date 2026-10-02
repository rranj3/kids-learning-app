"""
Quizzes routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.utils.database import get_db

router = APIRouter()

class QuestionResponse(BaseModel):
    id: str
    prompt: str
    answer_type: str  # multiple_choice, fill_blank, sequencing
    options: List[str] | None = None
    correct_answer: str
    hint: str | None = None
    explanation: str

class QuizResponse(BaseModel):
    id: str
    content_id: str
    title: str
    questions: List[QuestionResponse]

    class Config:
        from_attributes = True

class QuizSubmission(BaseModel):
    answers: dict  # { question_id: answer }

class QuizResult(BaseModel):
    quiz_id: str
    score: int
    passed: bool
    feedback: str

@router.get("/{story_id}", response_model=QuizResponse)
async def get_quiz_for_story(story_id: str, db: Session = Depends(get_db)):
    """Get comprehension quiz for a story"""
    # Placeholder for Phase 1
    if story_id == "story-001":
        return {
            "id": "quiz-001",
            "content_id": "story-001",
            "title": "Shreya and Neel's First Adventure - Quiz",
            "questions": [
                {
                    "id": "q1",
                    "prompt": "What did Shreya and Neel do together?",
                    "answer_type": "multiple_choice",
                    "options": ["Went on an adventure", "Watched TV", "Slept", "Ate lunch"],
                    "correct_answer": "Went on an adventure",
                    "explanation": "Shreya suggested going on an adventure in the backyard!",
                    "hint": "Look for the word 'adventure' in the story."
                },
                {
                    "id": "q2",
                    "prompt": "How old is Shreya?",
                    "answer_type": "multiple_choice",
                    "options": ["5", "7", "9", "11"],
                    "correct_answer": "9",
                    "explanation": "The story says Shreya is 9 years old.",
                    "hint": "It's a single-digit number greater than 8."
                },
                {
                    "id": "q3",
                    "prompt": "What did Neel try to count?",
                    "answer_type": "multiple_choice",
                    "options": ["Trees", "Flowers", "Butterflies", "All of the above"],
                    "correct_answer": "All of the above",
                    "explanation": "Neel counted trees with Shreya, and they also saw flowers and butterflies!",
                    "hint": "Shreya showed Neel different things in nature."
                }
            ]
        }

    raise HTTPException(status_code=404, detail="Quiz not found")

@router.post("/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(quiz_id: str, submission: QuizSubmission, db: Session = Depends(get_db)):
    """Submit quiz answers and get results"""
    # Placeholder for Phase 1
    score = 75  # Dummy score
    passed = score >= 70

    return {
        "quiz_id": quiz_id,
        "score": score,
        "passed": passed,
        "feedback": f"Great job! You scored {score}%. Keep practicing!" if passed else f"You scored {score}%. Try again and you'll do better!"
    }
