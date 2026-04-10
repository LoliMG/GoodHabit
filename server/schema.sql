-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habits Table (Permanent)
CREATE TABLE IF NOT EXISTS habits (
    habit_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    habit_name VARCHAR(255) NOT NULL,
    habit_icon VARCHAR(50) NOT NULL,
    habit_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- One-Time Habits Table
CREATE TABLE IF NOT EXISTS one_time_habits (
    oth_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    oth_name VARCHAR(255) NOT NULL,
    oth_date DATE NOT NULL,
    oth_is_completed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user_oth FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Progress Table (Tracking permanent habits)
CREATE TABLE IF NOT EXISTS progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    habit_id INT NOT NULL,
    progress_date DATE NOT NULL,
    progress_is_completed BOOLEAN DEFAULT TRUE,
    UNIQUE (user_id, habit_id, progress_date),
    CONSTRAINT fk_user_progress FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_habit_progress FOREIGN KEY (habit_id) REFERENCES habits(habit_id) ON DELETE CASCADE
);

-- Daily Notes Table
CREATE TABLE IF NOT EXISTS daily_notes (
    note_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    note_date DATE NOT NULL,
    note_content TEXT,
    UNIQUE (user_id, note_date),
    CONSTRAINT fk_user_notes FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Daily Moods Table
CREATE TABLE IF NOT EXISTS daily_moods (
    mood_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    mood_date DATE NOT NULL,
    mood_emoji VARCHAR(50) NOT NULL,
    UNIQUE (user_id, mood_date)
);

-- Admin User setup
-- Nota: La contraseña debería ser hasheada en la app, pero mantengo el mock
INSERT INTO users (user_name, user_email, user_password) 
VALUES ('Admin', 'admin@goodhabit.com', 'admin123')
ON CONFLICT (user_email) DO NOTHING;
