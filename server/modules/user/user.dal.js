import executeQuery from '../../config/db.js';

class UserDal {
    register = async (values) => {
        try {
            let sql = 'INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *';
            let result = await executeQuery(sql, values);
            return result;
        } catch (error) {
            throw error;
        }
    };

    findUserByEmail = async (email) => {
        try {
            let sql = 'SELECT user_id AS id, user_password AS password, user_name AS name, user_email AS email, user_is_public AS is_public, user_image AS image FROM users WHERE user_email = $1';
            let result = await executeQuery(sql, [email]);
            return result;
        } catch (error) {
            throw error;
        }
    };

    userByToken = async (id) => {
        try {
            let sql = 'SELECT user_id AS id, user_name AS name, user_email AS email, user_created_at AS created_at, user_is_public AS is_public, user_image AS image FROM users WHERE user_id = $1';
            let result = await executeQuery(sql, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    };

    editUser = async (values) => {
        try {
            let sql = 'UPDATE users SET user_name=$1, user_is_public=$2 WHERE user_id=$3';
            await executeQuery(sql, values);
        } catch (error) {
            throw error;
        }
    };

    editUserImage = async (values) => {
        try {
            let sql = 'UPDATE users SET user_image=$1 WHERE user_id=$2';
            await executeQuery(sql, values);
        } catch (error) {
            throw error;
        }
    };

    getAllPublicUsers = async () => {
        try {
            let sql = 'SELECT user_id AS id, user_name AS name, user_created_at AS created_at FROM users WHERE user_is_public = TRUE';
            let result = await executeQuery(sql);
            return result;
        } catch (error) {
            throw error;
        }
    };
}

export default new UserDal();