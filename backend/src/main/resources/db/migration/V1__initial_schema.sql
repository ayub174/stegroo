-- Skapa tabeller för jobbkategorier
CREATE TABLE job_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    external_id VARCHAR(255),
    parent_id BIGINT,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES job_categories (id)
);

-- Skapa index för jobbkategorier
CREATE INDEX idx_category_external_id ON job_categories (external_id);
CREATE INDEX idx_category_parent ON job_categories (parent_id);

-- Skapa tabeller för kompetenser
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(1000),
    external_id VARCHAR(255)
);

-- Skapa index för kompetenser
CREATE INDEX idx_skill_external_id ON skills (external_id);

-- Skapa tabeller för jobbannonser
CREATE TABLE job_listings (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(10000),
    company_name VARCHAR(255),
    location VARCHAR(255),
    external_id VARCHAR(255) UNIQUE,
    external_url VARCHAR(1000),
    source VARCHAR(50),
    employment_type VARCHAR(50),
    published_at TIMESTAMP,
    deadline TIMESTAMP,
    last_modified TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    category_id BIGINT,
    CONSTRAINT fk_job_category FOREIGN KEY (category_id) REFERENCES job_categories (id)
);

-- Skapa index för jobbannonser
CREATE INDEX idx_job_external_id ON job_listings (external_id);
CREATE INDEX idx_job_category ON job_listings (category_id);
CREATE INDEX idx_job_location ON job_listings (location);
CREATE INDEX idx_job_published_at ON job_listings (published_at);
CREATE INDEX idx_job_deadline ON job_listings (deadline);

-- Skapa tabeller för användarprofiler
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    bio VARCHAR(1000),
    location VARCHAR(255),
    account_type VARCHAR(50),
    company_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Skapa index för användarprofiler
CREATE INDEX idx_user_user_id ON user_profiles (user_id);

-- Skapa kopplingstabell för jobb och kompetenser
CREATE TABLE job_skills (
    job_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    CONSTRAINT fk_job_skills_job FOREIGN KEY (job_id) REFERENCES job_listings (id),
    CONSTRAINT fk_job_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (id)
);

-- Skapa kopplingstabell för användare och kompetenser
CREATE TABLE user_skills (
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, skill_id),
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES user_profiles (id),
    CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (id)
);

-- Skapa kopplingstabell för sparade jobb
CREATE TABLE saved_jobs (
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    saved_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, job_id),
    CONSTRAINT fk_saved_jobs_user FOREIGN KEY (user_id) REFERENCES user_profiles (id),
    CONSTRAINT fk_saved_jobs_job FOREIGN KEY (job_id) REFERENCES job_listings (id)
);

-- Skapa index för sparade jobb
CREATE INDEX idx_saved_jobs_saved_at ON saved_jobs (saved_at);
