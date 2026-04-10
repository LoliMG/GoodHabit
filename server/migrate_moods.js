import executeQuery from './config/db.js';

const runMigration = async () => {
    try {
        console.log("Starting mood migration...");
        
        // Create daily_moods table
        const createMoodsTable = `
        CREATE TABLE IF NOT EXISTS daily_moods (
            mood_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            mood_date DATE NOT NULL,
            mood_emoji VARCHAR(50) NOT NULL,
            UNIQUE(user_id, mood_date)
        );`;
        await executeQuery(createMoodsTable, []);
        console.log("Success: daily_moods table created.");

        // Migration: If we have note_mood in daily_notes, copy it to daily_moods
        // First check if column exists
        const checkColumn = "SELECT column_name FROM information_schema.columns WHERE table_name='daily_notes' AND column_name='note_mood'";
        const columns = await executeQuery(checkColumn, []);
        
        if (columns.length > 0) {
            console.log("Migrating existing moods from daily_notes to daily_moods...");
            const migrateData = `
            INSERT INTO daily_moods (user_id, mood_date, mood_emoji)
            SELECT user_id, note_date, note_mood 
            FROM daily_notes 
            WHERE note_mood IS NOT NULL AND note_mood <> ''
            ON CONFLICT (user_id, mood_date) DO NOTHING;
            `;
            await executeQuery(migrateData, []);
            console.log("Success: Existing moods migrated.");
            
            // Optionally remove the column from daily_notes later, but we'll leave it for now to avoid breaking existing queries
        }

        process.exit(0);
    } catch (err) {
        console.error("Migration Error:", err);
        process.exit(1);
    }
};

runMigration();
