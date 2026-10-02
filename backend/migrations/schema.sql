-- Kids Learning App Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (parents/guardians)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('parent', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Child profiles table
CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age_band VARCHAR(50) NOT NULL CHECK (age_band IN ('2yo', '3yo', '4-5yo', 'K-G2', 'G3-G4', 'G5-G6')),
    date_of_birth DATE,
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{"sound": true, "theme": "light"}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP
);

-- Content items table (stories, quizzes, games, etc.)
CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('story', 'quiz', 'game', 'grammar_lesson', 'math_problem')),
    age_band VARCHAR(50) NOT NULL CHECK (age_band IN ('2yo', '3yo', '4-5yo', 'K-G2', 'G3-G4', 'G5-G6')),
    subject VARCHAR(50) NOT NULL CHECK (subject IN ('ELA', 'MATH')),
    title VARCHAR(255) NOT NULL,
    body_markdown TEXT NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_duration_minutes INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stories table (extends content_items)
CREATE TABLE stories (
    id UUID PRIMARY KEY REFERENCES content_items(id) ON DELETE CASCADE,
    word_count INTEGER,
    illustration_urls TEXT[],
    vocabulary_list JSONB DEFAULT '[]',
    characters JSONB DEFAULT '[]'
);

-- Quizzes table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    questions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking table
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    content_type VARCHAR(50),
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    attempt_count INTEGER DEFAULT 1,
    ai_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning paths table (for adaptive learning)
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    recommended_items JSONB DEFAULT '[]',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_children_parent_id ON children(parent_id);
CREATE INDEX idx_children_age_band ON children(age_band);
CREATE INDEX idx_content_items_age_band_subject ON content_items(age_band, subject);
CREATE INDEX idx_content_items_difficulty ON content_items(difficulty_level);
CREATE INDEX idx_progress_child_id ON progress(child_id);
CREATE INDEX idx_progress_created_at ON progress(created_at);
CREATE INDEX idx_progress_child_content ON progress(child_id, content_id);
CREATE INDEX idx_quizzes_content_id ON quizzes(content_id);
CREATE INDEX idx_learning_paths_child_id ON learning_paths(child_id);
