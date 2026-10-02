"""
Children (child profiles) routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from uuid import UUID

from app.utils.database import get_db

router = APIRouter()

class ChildResponse(BaseModel):
    id: str
    name: str
    age_band: str
    avatar_url: str | None = None

    class Config:
        from_attributes = True

class ChildCreate(BaseModel):
    name: str
    age_band: str
    date_of_birth: str | None = None

@router.get("/", response_model=List[ChildResponse])
async def list_children(db: Session = Depends(get_db)):
    """
    Get all children profiles.
    Phase 1: Returns dummy data. Phase 2: Will filter by parent_id.
    """
    # Placeholder for Phase 1
    return [
        {
            "id": "shreya-001",
            "name": "Shreya",
            "age_band": "G3-G4",
            "avatar_url": "https://via.placeholder.com/150?text=Shreya"
        },
        {
            "id": "neel-001",
            "name": "Neel",
            "age_band": "2yo",
            "avatar_url": "https://via.placeholder.com/150?text=Neel"
        }
    ]

@router.post("/", response_model=ChildResponse)
async def create_child(child: ChildCreate, db: Session = Depends(get_db)):
    """Create a new child profile"""
    # Placeholder for Phase 1
    return {
        "id": "child-new",
        "name": child.name,
        "age_band": child.age_band,
        "avatar_url": None
    }

@router.get("/{child_id}", response_model=ChildResponse)
async def get_child(child_id: str, db: Session = Depends(get_db)):
    """Get a specific child's profile"""
    # Placeholder for Phase 1
    if child_id == "shreya-001":
        return {
            "id": "shreya-001",
            "name": "Shreya",
            "age_band": "G3-G4",
            "avatar_url": "https://via.placeholder.com/150?text=Shreya"
        }
    raise HTTPException(status_code=404, detail="Child not found")

@router.put("/{child_id}", response_model=ChildResponse)
async def update_child(child_id: str, child: ChildCreate, db: Session = Depends(get_db)):
    """Update a child's profile"""
    # Placeholder for Phase 1
    return {
        "id": child_id,
        "name": child.name,
        "age_band": child.age_band,
        "avatar_url": None
    }
