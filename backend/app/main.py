"""
Kids Learning App - FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.routes import auth, stories, quizzes, progress, children
from app.utils.database import engine, Base
from app.utils.config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting Kids Learning App API...")
    # Tables are created via migrations, but we can validate connection here
    yield
    # Shutdown
    logger.info("🛑 Shutting down Kids Learning App API...")

app = FastAPI(
    title="Kids Learning App API",
    description="Multi-age learning platform for children (ages 2-12)",
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(children.router, prefix="/api/children", tags=["children"])
app.include_router(stories.router, prefix="/api/stories", tags=["stories"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Kids Learning App API"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "Kids Learning App API",
        "version": "0.1.0",
        "docs": "/docs",
        "characters": ["Shreya", "Neel", "Krisha", "Adit"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
