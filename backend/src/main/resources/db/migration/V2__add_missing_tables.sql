-- Lägg till saknade tabeller för synkronisering och felhantering

-- Skapa tabell för synkroniseringscheckpoints
CREATE TABLE sync_checkpoints (
    id BIGSERIAL PRIMARY KEY,
    sync_type VARCHAR(50) NOT NULL UNIQUE,
    last_sync_at TIMESTAMP NOT NULL,
    last_cursor VARCHAR(1000),
    total_processed BIGINT DEFAULT 0,
    total_successful BIGINT DEFAULT 0,
    total_failed BIGINT DEFAULT 0,
    last_error_message VARCHAR(2000),
    status VARCHAR(50) NOT NULL,
    retry_count INTEGER DEFAULT 0,
    next_retry_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Skapa index för sync_checkpoints
CREATE INDEX idx_sync_checkpoints_sync_type ON sync_checkpoints (sync_type);
CREATE INDEX idx_sync_checkpoints_status ON sync_checkpoints (status);
CREATE INDEX idx_sync_checkpoints_next_retry_at ON sync_checkpoints (next_retry_at);

-- Skapa tabell för dead letter queue
CREATE TABLE dead_letter_queue (
    id BIGSERIAL PRIMARY KEY,
    external_id VARCHAR(255),
    sync_type VARCHAR(50) NOT NULL,
    job_data TEXT,
    error_type VARCHAR(255),
    error_message VARCHAR(2000),
    failure_reason VARCHAR(1000),
    stack_trace TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    status VARCHAR(50) NOT NULL,
    next_retry_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Skapa index för dead_letter_queue
CREATE INDEX idx_dlq_external_id ON dead_letter_queue (external_id);
CREATE INDEX idx_dlq_sync_type ON dead_letter_queue (sync_type);
CREATE INDEX idx_dlq_status ON dead_letter_queue (status);
CREATE INDEX idx_dlq_next_retry_at ON dead_letter_queue (next_retry_at);

-- Lägg till saknade kolumner i befintliga tabeller
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS working_hours_type VARCHAR(50);
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS removed_at TIMESTAMP;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS raw TEXT;

-- Lägg till saknade kolumner i job_categories
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS hierarchy_level INTEGER DEFAULT 0;
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS hierarchy_path VARCHAR(1000);
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS taxonomy_type VARCHAR(50);
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS legacy_ams_taxonomy_id VARCHAR(255);
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP;
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE job_categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Lägg till saknade kolumner i skills
ALTER TABLE skills ADD COLUMN IF NOT EXISTS taxonomy_type VARCHAR(50);
ALTER TABLE skills ADD COLUMN IF NOT EXISTS skill_level VARCHAR(50);
ALTER TABLE skills ADD COLUMN IF NOT EXISTS legacy_ams_taxonomy_id VARCHAR(255);
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE skills ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Skapa index för nya kolumner
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings (status);
CREATE INDEX IF NOT EXISTS idx_job_listings_removed_at ON job_listings (removed_at);
CREATE INDEX IF NOT EXISTS idx_job_categories_hierarchy_level ON job_categories (hierarchy_level);
CREATE INDEX IF NOT EXISTS idx_job_categories_is_active ON job_categories (is_active);
CREATE INDEX IF NOT EXISTS idx_skills_is_active ON skills (is_active);
