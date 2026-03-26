-- SQL Initialization Script for IntelliDX
-- This script runs once when the database volume is first created.

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_enum') THEN
        CREATE TYPE plan_enum AS ENUM ('free', 'pro', 'enterprise');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    plan plan_enum DEFAULT 'free' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert default admin user if not exists
-- Password corresponds to '1q2w3e4r5t' hashed via bcrypt
INSERT INTO users (id, email, hashed_password, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin', '$2b$12$TXrOEHNW1cwjuR0TbCl0..EwWXdBAROTjCKuNkhouewE5FHF7eUl6', 'pro')
ON CONFLICT (email) DO NOTHING;
