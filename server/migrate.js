import executeQuery from './config/db.js';

const runMigration = async () => {
    try {
        const sql = `
        CREATE TABLE IF NOT EXISTS daily_notes (
            note_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            note_date DATE NOT NULL,
            note_content TEXT,
            UNIQUE KEY unique_daily_note (user_id, note_date),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );`;
        await executeQuery(sql, []);
        console.log("Migration successful: Added daily_notes table.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runMigration();
