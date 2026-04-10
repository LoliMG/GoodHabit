import executeQuery from '../../config/db.js';

class NoteDal {
    getNotesByDateRange = async (userId, startDate, endDate) => {
        const sql = "SELECT note_id AS id, user_id, TO_CHAR(note_date, 'YYYY-MM-DD') AS date, note_content AS content, note_mood AS mood FROM daily_notes WHERE user_id = $1 AND note_date BETWEEN $2 AND $3";
        return await executeQuery(sql, [userId, startDate, endDate]);
    };

    saveNote = async (userId, date, content, mood = null) => {
        const sql = `
            INSERT INTO daily_notes (user_id, note_date, note_content, note_mood) 
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (user_id, note_date) 
            DO UPDATE SET 
                note_content = COALESCE(EXCLUDED.note_content, daily_notes.note_content),
                note_mood = COALESCE(EXCLUDED.note_mood, daily_notes.note_mood)
        `;
        return await executeQuery(sql, [userId, date, content, mood]);
    };

    updateMood = async (userId, date, mood) => {
        const sql = `
            INSERT INTO daily_notes (user_id, note_date, note_mood) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, note_date) 
            DO UPDATE SET note_mood = EXCLUDED.note_mood
        `;
        return await executeQuery(sql, [userId, date, mood]);
    };

    deleteNote = async (userId, date) => {
        const sql = 'DELETE FROM daily_notes WHERE user_id = $1 AND note_date = $2';
        return await executeQuery(sql, [userId, date]);
    };
}

export default new NoteDal();
