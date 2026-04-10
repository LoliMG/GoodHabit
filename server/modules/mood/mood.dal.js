import executeQuery from '../../config/db.js';

class MoodDal {
    getMoodsByUserId = async (userId) => {
        const sql = "SELECT mood_id AS id, user_id, TO_CHAR(mood_date, 'YYYY-MM-DD') AS date, mood_emoji AS emoji FROM daily_moods WHERE user_id = $1";
        return await executeQuery(sql, [userId]);
    };

    saveMood = async (userId, date, emoji) => {
        const sql = `
            INSERT INTO daily_moods (user_id, mood_date, mood_emoji) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, mood_date) 
            DO UPDATE SET mood_emoji = EXCLUDED.mood_emoji
        `;
        return await executeQuery(sql, [userId, date, emoji]);
    };

    deleteMood = async (userId, date) => {
        const sql = 'DELETE FROM daily_moods WHERE user_id = $1 AND mood_date = $2';
        return await executeQuery(sql, [userId, date]);
    };
}

export default new MoodDal();
