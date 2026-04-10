-- 1. Crear la nueva tabla de Ánimos (totalmente separada)
CREATE TABLE IF NOT EXISTS daily_moods (
    mood_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    mood_date DATE NOT NULL,
    mood_emoji VARCHAR(50) NOT NULL,
    UNIQUE(user_id, mood_date)
);

-- 2. Migrar los emojis de ánimo actuales hacia la nueva tabla
INSERT INTO daily_moods (user_id, mood_date, mood_emoji)
SELECT user_id, note_date, note_mood 
FROM daily_notes 
WHERE note_mood IS NOT NULL AND note_mood <> ''
ON CONFLICT (user_id, mood_date) DO NOTHING;

-- 3. Limpiar la tabla de Notas (Eliminar la columna antigua de ánimo)
-- Esto deja la tabla daily_notes exclusiva para el contenido de texto (Reflexiones)
ALTER TABLE daily_notes DROP COLUMN IF EXISTS note_mood;

-- 4. Asegurarse de que el contenido de las notas sea de tipo TEXT para notas largas
-- (Supabase/Postgres TEXT no tiene límite práctico de caracteres)
ALTER TABLE daily_notes ALTER COLUMN note_content TYPE TEXT;
