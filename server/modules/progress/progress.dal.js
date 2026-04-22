import executeQuery from '../../config/db.js';

class ProgressDal {
    toggleProgress = async (values) => {
        // values = [user_id, habit_id, progress_date]
        const checkSql = 'SELECT progress_is_completed FROM progress WHERE user_id = $1 AND habit_id = $2 AND progress_date = $3';
        const exists = await executeQuery(checkSql, values);

        if (exists.length > 0) {
            // Toggle the boolean
            const newStatus = !exists[0].progress_is_completed;
            const updateSql = 'UPDATE progress SET progress_is_completed = $4 WHERE user_id = $1 AND habit_id = $2 AND progress_date = $3';
            return await executeQuery(updateSql, [...values, newStatus]);
        } else {
            // Create as completed (standard toggle)
            const insertSql = 'INSERT INTO progress (user_id, habit_id, progress_date, progress_is_completed) VALUES ($1, $2, $3, true)';
            return await executeQuery(insertSql, values);
        }
    };

    activateProgress = async (values) => {
        // Create as NOT completed (just activated for the day)
        // Check if already exists to avoid duplicates
        const checkSql = 'SELECT 1 FROM progress WHERE user_id = $1 AND habit_id = $2 AND progress_date = $3';
        const exists = await executeQuery(checkSql, values);
        
        if (exists.length === 0) {
            const insertSql = 'INSERT INTO progress (user_id, habit_id, progress_date, progress_is_completed) VALUES ($1, $2, $3, false)';
            return await executeQuery(insertSql, values);
        }
        return { message: 'Already activated' };
    };

    deleteProgress = async (values) => {
        // values = [user_id, habit_id, progress_date]
        const sql = 'DELETE FROM progress WHERE user_id = $1 AND habit_id = $2 AND progress_date = $3';
        return await executeQuery(sql, values);
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
