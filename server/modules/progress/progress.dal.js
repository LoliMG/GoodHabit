import executeQuery from '../../config/db.js';

class ProgressDal {
    toggleProgress = async (values) => {
        // Find if it exists
        const checkSql = 'SELECT * FROM progress WHERE user_id = $1 AND habit_id = $2 AND progress_date = $3';
        const exists = await executeQuery(checkSql, values);

        if (exists.length > 0) {
            // Toggle
            const toggleSql = 'DELETE FROM progress WHERE user_id = $1 AND habit_id = $2 AND progress_date = $3';
            return await executeQuery(toggleSql, values);
        } else {
            // Create
            const insertSql = 'INSERT INTO progress (user_id, habit_id, progress_date) VALUES ($1, $2, $3)';
            return await executeQuery(insertSql, values);
        }
    };

    getProgressByDateRange = async (userId, startDate, endDate) => {
        const sql = "SELECT progress_id AS id, user_id, habit_id, TO_CHAR(progress_date, 'YYYY-MM-DD') AS date, progress_is_completed AS is_completed FROM progress WHERE user_id = $1 AND progress_date BETWEEN $2 AND $3";
        return await executeQuery(sql, [userId, startDate, endDate]);
    };

    getHabitStats = async (userId, habitId) => {
        const sql = 'SELECT COUNT(*) as count FROM progress WHERE user_id = $1 AND habit_id = $2';
        const result = await executeQuery(sql, [userId, habitId]);
        return result[0].count;
    };
}

export default new ProgressDal();
