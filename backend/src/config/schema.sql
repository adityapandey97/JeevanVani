-- JeevanVani Database Schema
-- Designed for PostgreSQL & SQLite with pgvector readiness for semantic search

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
    preferred_sector VARCHAR(255),
    training_preference VARCHAR(255),
    constraints TEXT,
    career_goal VARCHAR(255),
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
    confidence_score DECIMAL(5,2) DEFAULT 85.0,
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

-- Real Verified Jobs (National Career Service, PM-AJAY District Cells, NSDC)
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    sector VARCHAR(255) NOT NULL,
    job_role_id INTEGER REFERENCES job_roles(id) ON DELETE SET NULL,
    location VARCHAR(255) NOT NULL,
    eligibility VARCHAR(255) NOT NULL,
    salary VARCHAR(100),
    application_url VARCHAR(500),
    source VARCHAR(100) NOT NULL,
    source_id VARCHAR(100),
    required_skills TEXT,
    is_verified INTEGER DEFAULT 1,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    last_verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real Verified NSQF Training Courses (Skill India Digital, PMKVY 4.0, PM-AJAY GIA)
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    qualification_pack_id VARCHAR(100),
    job_role_id INTEGER REFERENCES job_roles(id) ON DELETE SET NULL,
    nsqf_level INTEGER NOT NULL,
    duration VARCHAR(100) NOT NULL,
    eligibility VARCHAR(255) NOT NULL,
    skills_covered TEXT,
    training_provider VARCHAR(255) NOT NULL,
    training_center_location VARCHAR(255),
    mode VARCHAR(50) DEFAULT 'Offline / Hands-on',
    certification_body VARCHAR(255) DEFAULT 'NCVET / NSDC',
    rpl_available INTEGER DEFAULT 1,
    enrollment_url VARCHAR(500),
    is_verified INTEGER DEFAULT 1,
    source VARCHAR(100) DEFAULT 'Skill India Digital / PMKVY 4.0',
    stipend_info VARCHAR(255),
    last_verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiary Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'submitted',
    notes TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiary Course Enrollments & RPL Tracking
CREATE TABLE IF NOT EXISTS course_enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'enrolled',
    enrollment_type VARCHAR(50) DEFAULT 'Fresh Training',
    completion_percent INTEGER DEFAULT 0,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Human Review Queue for Low-Confidence Recommendations
CREATE TABLE IF NOT EXISTS human_reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recommendation_id INTEGER REFERENCES recommendations(id) ON DELETE CASCADE,
    confidence_score DECIMAL(5,2) NOT NULL,
    flag_reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    reviewer_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- Recommendation Feedback
CREATE TABLE IF NOT EXISTS recommendation_feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL,
    target_id INTEGER NOT NULL,
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grounded Knowledge Documents for NSQF & PM-AJAY RAG
CREATE TABLE IF NOT EXISTS knowledge_docs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    nsqf_level INTEGER,
    sector VARCHAR(100),
    content TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    source_url VARCHAR(500),
    keywords TEXT,
    last_verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beneficiary Consents (GIA PM-AJAY Compliance)
CREATE TABLE IF NOT EXISTS beneficiary_consents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    granted INTEGER DEFAULT 1,
    ip_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
