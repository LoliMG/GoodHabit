-- Migration: Create note_likes table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS note_likes (
    like_id   SERIAL PRIMARY KEY,
    user_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note_id   INTEGER NOT NULL REFERENCES daily_notes(note_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, note_id)
);

-- Index for fast lookup by note
CREATE INDEX IF NOT EXISTS idx_note_likes_note_id ON note_likes(note_id);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_note_likes_user_id ON note_likes(user_id);
