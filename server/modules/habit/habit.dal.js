import executeQuery from '../../config/db.js';

class HabitDal {
    addHabit = async (values) => {
        let sql = 'INSERT INTO habits (user_id, habit_name, habit_icon) VALUES ($1, $2, $3) RETURNING *';
        return await executeQuery(sql, values);
    };

    getHabitsByUserId = async (userId) => {
        let sql = `
            SELECT 
                h.habit_id AS id, 
                h.user_id, 
                h.habit_name AS name, 
                h.habit_icon AS icon, 
                h.habit_created_at AS created_at,
                (SELECT COUNT(*) FROM progress p WHERE p.habit_id = h.habit_id AND p.progress_is_completed = true) AS total_completions
            FROM habits h
            WHERE h.user_id = $1
            ORDER BY h.habit_created_at ASC
        `;
        return await executeQuery(sql, [userId]);
    };

    updateHabit = async (values) => {
        // En Postgres los parámetros se numeran: habit_name ($1), habit_icon ($2), habit_id ($3), user_id ($4)
        let sql = 'UPDATE habits SET habit_name = $1, habit_icon = $2 WHERE habit_id = $3 AND user_id = $4';
        return await executeQuery(sql, values);
    };

    deleteHabit = async (habitId, userId) => {
        let sql = 'DELETE FROM habits WHERE habit_id = $1 AND user_id = $2';
        return await executeQuery(sql, [habitId, userId]);
    };

    // One-Time Habits
    addOneTimeHabit = async (values) => {
        let sql = 'INSERT INTO one_time_habits (user_id, oth_name, oth_date) VALUES ($1, $2, $3) RETURNING *';
        return await executeQuery(sql, values);
    };

    getOneTimeHabits = async (userId, date = null) => {
        let sql = "SELECT oth_id AS id, user_id, oth_name AS name, TO_CHAR(oth_date, 'YYYY-MM-DD') AS date, oth_is_completed AS is_completed FROM one_time_habits WHERE user_id = $1";
        let params = [userId];
        if (date) {
            sql += ' AND oth_date = $2';
            params.push(date);
        }
        return await executeQuery(sql, params);
    };

    toggleOneTimeHabit = async (otId, userId) => {
        let sql = 'UPDATE one_time_habits SET oth_is_completed = NOT oth_is_completed WHERE oth_id = $1 AND user_id = $2';
        return await executeQuery(sql, [otId, userId]);
    };

    deleteOneTimeHabit = async (otId, userId) => {
        let sql = 'DELETE FROM one_time_habits WHERE oth_id = $1 AND user_id = $2';
        return await executeQuery(sql, [otId, userId]);
    };
}

export default new HabitDal();
