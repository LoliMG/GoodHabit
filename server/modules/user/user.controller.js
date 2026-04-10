import { hashPassword, comparePassword } from '../../utils/bcryptUtils.js';
import { generateToken } from '../../utils/jwtUtils.js';
import userDal from './user.dal.js';
import habitDal from '../habit/habit.dal.js';
import progressDal from '../progress/progress.dal.js';
import noteDal from '../note/note.dal.js';

class UserController {
    register = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            let hashedPass = await hashPassword(password);
            let result = await userDal.register([name, email, hashedPass]);
            res.status(200).json({ message: 'Registration successful', userId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to register' });
        }
    };

    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            let result = await userDal.findUserByEmail(email);

            if (result.length === 0) {
                res.status(401).json({ message: 'Email does not exist' });
            } else {
                let match = await comparePassword(password, result[0].password);
                if (!match) {
                    res.status(401).json({ message: 'Incorrect password' });
                } else {
                    const userId = result[0].id;
                    const token = generateToken(userId);
                    
                    // Fetch all associated data
                    const habits = await habitDal.getHabitsByUserId(userId);
                    // For simplicity, we return all one-time and progress for now, or you can filter by range
                    // Here we'll just return what's there
                    const oneTimeHabits = await habitDal.getOneTimeHabits(userId); 
                    const progress = await progressDal.getProgressByDateRange(userId, '1970-01-01', '2100-01-01');
                    const notes = await noteDal.getNotesByDateRange(userId, '1970-01-01', '2100-01-01');

                    res.status(200).json({ 
                        message: 'Login successful', 
                        token, 
                        user: { id: userId, name: result[0].name, email: result[0].email },
                        habits,
                        oneTimeHabits,
                        progress,
                        notes
                    });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Login failed' });
        }
    };

    userByToken = async (req, res) => {
        const { user_id } = req;
        try {
            const user = await userDal.userByToken(user_id);
            const habits = await habitDal.getHabitsByUserId(user_id);
            // Assuming we want to load all user data on initial fetch
            const oneTimeHabits = await habitDal.getOneTimeHabits(user_id);
            const progress = await progressDal.getProgressByDateRange(user_id, '1970-01-01', '2100-01-01');
            const notes = await noteDal.getNotesByDateRange(user_id, '1970-01-01', '2100-01-01');

            res.status(200).json({ 
                message: 'User found', 
                user, 
                habits, 
                oneTimeHabits, 
                progress,
                notes
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to find user' });
        }
    };

    googleLogin = async (req, res) => {
        try {
            const { email, name, googleId } = req.body;
            let result = await userDal.findUserByEmail(email);
            
            let userId;
            let userName;
            let userEmail;

            if (result.length === 0) {
                // Register the user automatically
                let hashedPass = await hashPassword(googleId || 'google_auth_placeholder');
                let insertResult = await userDal.register([name, email, hashedPass]);
                userId = insertResult.insertId;
                userName = name;
                userEmail = email;
            } else {
                // User exists, log them in
                userId = result[0].id;
                userName = result[0].name;
                userEmail = result[0].email || email;
            }

            const token = generateToken(userId);
            
            const habits = await habitDal.getHabitsByUserId(userId);
            const oneTimeHabits = await habitDal.getOneTimeHabits(userId); 
            const progress = await progressDal.getProgressByDateRange(userId, '1970-01-01', '2100-01-01');
            const notes = await noteDal.getNotesByDateRange(userId, '1970-01-01', '2100-01-01');

            res.status(200).json({ 
                message: 'Google Login successful', 
                token, 
                user: { id: userId, name: userName, email: userEmail },
                habits,
                oneTimeHabits,
                progress,
                notes
            });
        } catch (error) {
            console.error("Google Login Error locally:", error);
            res.status(500).json({ error: 'Google Login failed' });
        }
    };

    editUser = async (req, res) => {
        try {
            const { name } = req.body;
            const { user_id } = req;
            await userDal.editUser([name, user_id]);
            res.status(200).json({ message: 'Update successful' });
        } catch (error) {
            res.status(500).json({ error: 'Update failed' });
        }
    };
}

export default new UserController();