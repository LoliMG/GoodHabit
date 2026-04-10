import executeQuery from '../../config/db.js';

class HabitDal {
    addHabit = async (values) => {
        let sql = 'INSERT INTO habits (user_id, habit_name, habit_icon) VALUES (?,?,?)';
        return await executeQuery(sql, values);
    };

    getHabitsByUserId = async (userId) => {
        let sql = 'SELECT habit_id AS id, user_id, habit_name AS name, habit_icon AS icon, habit_created_at AS created_at FROM habits WHERE user_id = ?';
        return await executeQuery(sql, [userId]);
    };

    updateHabit = async (values) => {
        let sql = 'UPDATE habits SET habit_name = ?, habit_icon = ? WHERE habit_id = ? AND user_id = ?';
        return await executeQuery(sql, values);
    };

    deleteHabit = async (habitId, userId) => {
        let sql = 'DELETE FROM habits WHERE habit_id = ? AND user_id = ?';
        return await executeQuery(sql, [habitId, userId]);
    };

    // One-Time Habits
    addOneTimeHabit = async (values) => {
        let sql = 'INSERT INTO one_time_habits (user_id, oth_name, oth_date) VALUES (?,?,?)';
        return await executeQuery(sql, values);
    };

    getOneTimeHabits = async (userId, date = null) => {
        let sql = "SELECT oth_id AS id, user_id, oth_name AS name, DATE_FORMAT(oth_date, '%Y-%m-%d') AS date, oth_is_completed AS is_completed FROM one_time_habits WHERE user_id = ?";
        let params = [userId];
        if (date) {
            sql += ' AND oth_date = ?';
            params.push(date);
        }
        return await executeQuery(sql, params);
    };

    toggleOneTimeHabit = async (otId, userId) => {
        let sql = 'UPDATE one_time_habits SET oth_is_completed = NOT oth_is_completed WHERE oth_id = ? AND user_id = ?';
        return await executeQuery(sql, [otId, userId]);
    };
}

export default new HabitDal();
