"""
Stories routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.utils.database import get_db

router = APIRouter()

class StoryResponse(BaseModel):
    id: str
    title: str
    body_markdown: str
    age_band: str
    subject: str
    difficulty_level: int
    estimated_duration_minutes: int
    word_count: int | None = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[StoryResponse])
async def list_stories(
    age_band: str | None = Query(None),
    subject: str | None = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    """
    Get stories with optional filtering by age_band and subject.
    Phase 1: Returns dummy stories. Phase 2: Query from database.
    """
    # Placeholder stories for Phase 1
    all_stories = [
        {
            "id": "story-001",
            "title": "Shreya and Neel's First Adventure",
            "body_markdown": "# Shreya and Neel's First Adventure\n\nOnce upon a time, Shreya took her little brother Neel...",
            "age_band": "2yo",
            "subject": "ELA",
            "difficulty_level": 1,
            "estimated_duration_minutes": 5,
            "word_count": 150
        },
        {
            "id": "story-002",
            "title": "Counting with Neel",
            "body_markdown": "# Counting with Neel\n\nNeel loves to count. One, two, three...",
            "age_band": "2yo",
            "subject": "MATH",
            "difficulty_level": 1,
            "estimated_duration_minutes": 5,
            "word_count": 120
        },
        {
            "id": "story-003",
            "title": "Shreya's School Day",
            "body_markdown": "# Shreya's School Day\n\nShreyashare went to school one morning with her friend Krisha...",
            "age_band": "G3-G4",
            "subject": "ELA",
            "difficulty_level": 2,
            "estimated_duration_minutes": 10,
            "word_count": 600
        }
    ]

    # Filter if parameters provided
    if age_band:
        all_stories = [s for s in all_stories if s["age_band"] == age_band]
    if subject:
        all_stories = [s for s in all_stories if s["subject"] == subject]

    return all_stories[skip:skip + limit]

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(story_id: str, db: Session = Depends(get_db)):
    """Get a specific story"""
    # Placeholder for Phase 1
    if story_id == "story-001":
        return {
            "id": "story-001",
            "title": "Shreya and Neel's First Adventure",
            "body_markdown": "# Shreya and Neel's First Adventure\n\n*Once upon a time, in a cozy home overlooking the mountains, lived two siblings: Shreya (9 years old) and her little brother Neel (2 years old).*\n\nShreyaloved telling stories to Neel, and Neel loved listening, even though he didn't understand all the words.\n\nOne sunny afternoon, Shreya had an idea. \"Neel, let's go on an adventure!\" she said with excitement.\n\nNeel clapped his hands. \"Adben-chure!\" he said, trying to repeat the word.\n\nThey started in the backyard. Shreya pointed at different things. \"Look, Neel! That's a flower. Can you say flower?\"\n\n\"Flooower!\" said Neel, giggling.\n\nThey found a butterfly. \"Butterfly!\" said Shreya.\n\n\"Butter-fly!\" repeated Neel, chasing it.\n\nThen they counted the trees. \"One, two, three!\" counted Shreya.\n\n\"One! Two! Tree!\" said Neel proudly.\n\nAs the sun started to set, Shreya hugged her little brother. \"Did you have fun on our adventure, Neel?\"\n\n\"Yesyes! Again! Again!\" squealed Neel.\n\nThey walked back inside, hand in hand, ready for hot chocolate and cookies—the best way to end an adventure.\n\n---\n\n**The End**",
            "age_band": "2yo",
            "subject": "ELA",
            "difficulty_level": 1,
            "estimated_duration_minutes": 5,
            "word_count": 220
        }
    elif story_id == "story-002":
        return {
            "id": "story-002",
            "title": "Counting with Neel",
            "body_markdown": "# Counting with Neel\n\n*Shreya decides to teach Neel how to count using fun objects.*\n\n\"Neel, let's count!\" said Shreya, pulling out some colorful blocks.\n\n**One block.** \"One!\" said Neel, touching it.\n\n**Two blocks.** \"One, two!\" counted Neel carefully.\n\n**Three blocks.** \"One, two, three!\" He was getting better!\n\n**Four blocks.** Neel counted slowly: \"One... two... three... four!\"\n\n**Five blocks.** \"One, two, three, four, FIVE!\" Neel shouted with joy.\n\nShreyaclapped. \"You did it, Neel! You can count to five!\"\n\nNeel hugged his blocks. Counting was fun!",
            "age_band": "2yo",
            "subject": "MATH",
            "difficulty_level": 1,
            "estimated_duration_minutes": 5,
            "word_count": 125
        }

    raise HTTPException(status_code=404, detail="Story not found")

@router.post("/ingest")
async def ingest_stories(db: Session = Depends(get_db)):
    """
    Ingest stories from Markdown files.
    Endpoint for the story ingestion pipeline (used during deployment).
    """
    return {"message": "Story ingestion pipeline ready. Upload Markdown files to /backend/content/stories/"}
