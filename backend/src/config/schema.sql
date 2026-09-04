-- JeevanVani Database Schema
-- Designed for PostgreSQL with pgvector readiness for future semantic search

-- Optional: Enable pgvector extension when running on full PostgreSQL with pgvector installed
-- CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    role VARCHAR(50) DEFAULT 'beneficiary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS beneficiary_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    education VARCHAR(255),
    employment_status VARCHAR(255),
    work_experience VARCHAR(255),
    preferred_location VARCHAR(255),
    willing_to_relocate BOOLEAN DEFAULT false,
    employment_preference VARCHAR(100),
    profile_completion INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50) DEFAULT 'Beginner',
    UNIQUE(user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interest_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS job_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    nsqf_level INTEGER NOT NULL,
    description TEXT NOT NULL,
    required_education VARCHAR(255) NOT NULL,
    training_duration VARCHAR(255) NOT NULL,
    career_path TEXT NOT NULL,
    -- Future pgvector semantic embedding column:
    -- embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_role_skills (
    id SERIAL PRIMARY KEY,
    job_role_id INTEGER REFERENCES job_roles(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    importance_weight DECIMAL(3,2) DEFAULT 1.0,
    required_level VARCHAR(50) DEFAULT 'Basic',
    UNIQUE(job_role_id, skill_id)
);

CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_role_id INTEGER REFERENCES job_roles(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL,
    interest_score DECIMAL(5,2) NOT NULL,
    skill_score DECIMAL(5,2) NOT NULL,
    eligibility_score DECIMAL(5,2) NOT NULL,
    experience_score DECIMAL(5,2) NOT NULL,
    location_score DECIMAL(5,2) NOT NULL,
    why_recommended TEXT,
    matching_skills TEXT,
    missing_skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_question_index INTEGER DEFAULT 0,
    answers TEXT DEFAULT '{}',
    transcript TEXT DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
