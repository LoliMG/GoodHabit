import executeQuery from '../../config/db.js';

class NoteDal {
    getNotesByDateRange = async (userId, startDate, endDate) => {
        const sql = "SELECT note_id AS id, user_id, DATE_FORMAT(note_date, '%Y-%m-%d') AS date, note_content AS content FROM daily_notes WHERE user_id = ? AND note_date BETWEEN ? AND ?";
        return await executeQuery(sql, [userId, startDate, endDate]);
    };

    saveNote = async (userId, date, content) => {
        const sql = `
            INSERT INTO daily_notes (user_id, note_date, note_content) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE note_content = VALUES(note_content)
        `;
        return await executeQuery(sql, [userId, date, content]);
    };

    deleteNote = async (userId, date) => {
        const sql = 'DELETE FROM daily_notes WHERE user_id = ? AND note_date = ?';
        return await executeQuery(sql, [userId, date]);
    };
}

export default new NoteDal();
