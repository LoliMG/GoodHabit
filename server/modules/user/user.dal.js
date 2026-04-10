import executeQuery from '../../config/db.js';

class UserDal {
    register = async (values) => {
        try {
            let sql = 'INSERT INTO users (user_name, user_email, user_password) VALUES (?,?,?)';
            let result = await executeQuery(sql, values);
            return result;
        } catch (error) {
            throw error;
        }
    };

    findUserByEmail = async (email) => {
        try {
            let sql = 'SELECT user_id AS id, user_password AS password, user_name AS name, user_email AS email FROM users WHERE user_email = ?';
            let result = await executeQuery(sql, [email]);
            return result;
        } catch (error) {
            throw error;
        }
    };

    userByToken = async (id) => {
        try {
            let sql = 'SELECT user_id AS id, user_name AS name, user_email AS email, user_created_at AS created_at FROM users WHERE user_id = ?';
            let result = await executeQuery(sql, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    };

    editUser = async (values) => {
        try {
            let sql = 'UPDATE users SET user_name=? WHERE user_id=?';
            await executeQuery(sql, values);
        } catch (error) {
            throw error;
        }
    };
}

export default new UserDal();