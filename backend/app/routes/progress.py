"""
Progress tracking routes
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.utils.database import get_db

router = APIRouter()

class ProgressRecord(BaseModel):
    id: str
    child_id: str
    content_id: str
    content_type: str
    completed_at: datetime | None = None
    time_spent_seconds: int | None = None
    score: int | None = None
    attempt_count: int = 1

    class Config:
        from_attributes = True

class ProgressSummary(BaseModel):
    child_id: str
    total_stories_completed: int
    total_quizzes_completed: int
    average_score: float
    total_learning_time_minutes: int
    recent_activity: List[ProgressRecord]

@router.get("/{child_id}/summary", response_model=ProgressSummary)
async def get_progress_summary(child_id: str, db: Session = Depends(get_db)):
    """Get child's learning progress summary"""
    # Placeholder for Phase 1
    return {
        "child_id": child_id,
        "total_stories_completed": 2,
        "total_quizzes_completed": 2,
        "average_score": 85.0,
        "total_learning_time_minutes": 15,
        "recent_activity": [
            {
                "id": "progress-001",
                "child_id": child_id,
                "content_id": "story-001",
                "content_type": "story",
                "completed_at": datetime.now(),
                "time_spent_seconds": 300,
                "score": 85,
                "attempt_count": 1
            }
        ]
    }

@router.get("/{child_id}/history", response_model=List[ProgressRecord])
async def get_progress_history(
    child_id: str,
    limit: int = Query(20),
    db: Session = Depends(get_db)
):
    """Get child's learning history"""
    # Placeholder for Phase 1
    return [
        {
            "id": "progress-001",
            "child_id": child_id,
            "content_id": "story-001",
            "content_type": "story",
            "completed_at": datetime.now(),
            "time_spent_seconds": 300,
            "score": None,
            "attempt_count": 1
        },
        {
            "id": "progress-002",
            "child_id": child_id,
            "content_id": "quiz-001",
            "content_type": "quiz",
            "completed_at": datetime.now(),
            "time_spent_seconds": 120,
            "score": 85,
            "attempt_count": 1
        }
    ]

@router.post("/{child_id}/log")
async def log_progress(child_id: str, record: ProgressRecord, db: Session = Depends(get_db)):
    """Log a learning activity"""
    # Placeholder for Phase 1
    return {
        "message": "Progress logged successfully",
        "child_id": child_id,
        "content_id": record.content_id
    }
