CREATE DATABASE IF NOT EXISTS goodhabit;
USE goodhabit;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habits Table (Permanent)
CREATE TABLE IF NOT EXISTS habits (
    habit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    habit_name VARCHAR(255) NOT NULL,
    habit_icon VARCHAR(50) NOT NULL,
    habit_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- One-Time Habits Table
CREATE TABLE IF NOT EXISTS one_time_habits (
    oth_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    oth_name VARCHAR(255) NOT NULL,
    oth_date DATE NOT NULL,
    oth_is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Progress Table (Tracking permanent habits)
CREATE TABLE IF NOT EXISTS progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    habit_id INT NOT NULL,
    progress_date DATE NOT NULL,
    progress_is_completed BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_daily_habit (user_id, habit_id, progress_date),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES habits(habit_id) ON DELETE CASCADE
);

-- Insert Mock Admin User
INSERT INTO users (user_name, user_email, user_password) 
VALUES ('Admin', 'admin@goodhabit.com', 'admin123');

-- Daily Notes Table
CREATE TABLE IF NOT EXISTS daily_notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    note_date DATE NOT NULL,
    note_content TEXT,
    UNIQUE KEY unique_daily_note (user_id, note_date),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
