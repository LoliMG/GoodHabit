import { hashPassword, comparePassword } from '../../utils/bcryptUtils.js';
import { generateToken } from '../../utils/jwtUtils.js';
import userDal from './user.dal.js';
import habitDal from '../habit/habit.dal.js';
import progressDal from '../progress/progress.dal.js';
import noteDal from '../note/note.dal.js';
import moodDal from '../mood/mood.dal.js';
import { supabase } from '../../config/supabase.js';


const formatMoods = (moods) => {
    return moods.reduce((acc, current) => {
        acc[current.date] = current.emoji;
        return acc;
    }, {});
};

class UserController {
    register = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            let hashedPass = await hashPassword(password);
            let result = await userDal.register([name, email, hashedPass]);
            res.status(200).json({ message: 'Registration successful', userId: result[0].user_id });
        } catch (error) {
            console.error(error);
            if (error.code === '23505') {
                return res.status(400).json({ message: 'Ese correo electrónico ya está registrado' });
            }
            res.status(500).json({ message: 'Error al registrar el usuario' });
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
                    // Fetch moods safely
                    let userMoods = {};
                    try {
                        const moodsData = await moodDal.getMoodsByUserId(userId);
                        userMoods = formatMoods(moodsData);
                    } catch (mErr) {
                        console.error("Non-critical: Failed to load moods during login", mErr);
                    }

                    res.status(200).json({ 
                        message: 'Login successful', 
                        token, 
                        user: { id: userId, name: result[0].name, email: result[0].email, is_public: result[0].is_public, image: result[0].image || null },
                        habits,
                        oneTimeHabits,
                        progress,
                        notes,
                        moods: userMoods
                    });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al iniciar sesión' });
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
            // Fetch moods safely
            let userMoods = {};
            try {
                const moodsData = await moodDal.getMoodsByUserId(user_id);
                userMoods = formatMoods(moodsData);
            } catch (mErr) {
                console.error("Non-critical: Failed to load moods during userByToken", mErr);
            }

            res.status(200).json({ 
                message: 'User found', 
                user, 
                habits, 
                oneTimeHabits, 
                progress,
                notes,
                moods: userMoods
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to find user' });
        }
    };

    googleLogin = async (req, res) => {
        try {
            const { access_token } = req.body;
            
            if (!access_token) {
                return res.status(400).json({ message: 'Token de Google no proporcionado' });
            }

            // Verify token with Google API from server-side
            const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            if (!googleRes.ok) {
                return res.status(401).json({ message: 'Token de Google inválido' });
            }

            const userInfo = await googleRes.json();
            const { email, name, sub: googleId } = userInfo;

            let result = await userDal.findUserByEmail(email);
            
            let userId;
            let userName;
            let userEmail;
            let userImage;

            if (result.length === 0) {
                // Register the user automatically
                let hashedPass = await hashPassword(googleId || 'google_auth_placeholder');
                let insertResult = await userDal.register([name, email, hashedPass]);
                userId = insertResult[0].user_id;
                userName = name;
                userEmail = email;
                userImage = null;
            } else {
                // User exists, log them in
                userId = result[0].id;
                userName = result[0].name;
                userEmail = result[0].email || email;
                userImage = result[0].image || null;
            }

            const token = generateToken(userId);
            
            const habits = await habitDal.getHabitsByUserId(userId);
            const oneTimeHabits = await habitDal.getOneTimeHabits(userId); 
            const progress = await progressDal.getProgressByDateRange(userId, '1970-01-01', '2100-01-01');
            const notes = await noteDal.getNotesByDateRange(userId, '1970-01-01', '2100-01-01');

            // Fetch moods safely
            let userMoods = {};
            try {
                const moodsData = await moodDal.getMoodsByUserId(userId);
                userMoods = formatMoods(moodsData);
            } catch (mErr) {
                console.error("Non-critical: Failed to load moods during googleLogin", mErr);
            }

            res.status(200).json({ 
                message: 'Google Login successful', 
                token, 
                user: { 
                    id: userId, 
                    name: userName, 
                    email: userEmail, 
                    is_public: result.length === 0 ? false : result[0].is_public,
                    image: userImage
                },
                habits,
                oneTimeHabits,
                progress,
                notes,
                moods: userMoods
            });
        } catch (error) {
            console.error("Google Login Error:", error);
            res.status(500).json({ message: 'Error en la verificación con Google' });
        }
    };

    editUser = async (req, res) => {
        try {
            const { name, is_public } = req.body;
            const { user_id } = req;
            await userDal.editUser([name, is_public, user_id]);
            res.status(200).json({ message: 'Update successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Update failed' });
        }
    };


    editImage = async (req, res) => {
        try {
            const { user_id } = req;
            if (!req.file) return res.status(400).json({ message: "No se ha subido ninguna imagen" });
            
            // Create a unique filename
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${user_id}-${Date.now()}.${fileExt}`;
            const filePath = `users/${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('images') // Asegúrate de tener un bucket llamado 'images'
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (error) {
                console.error("Error uploading to Supabase:", error);
                return res.status(500).json({ 
                    error: 'Fallo al subir a Supabase Storage', 
                    details: error.message,
                    tip: '¿Has creado el bucket "images" y puesto las variables en Vercel?' 
                });
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
            
            // Save the URL (or filename) in DB
            await userDal.editUserImage([publicUrl, user_id]);
            
            res.status(200).json({ message: 'Image updated', filename: publicUrl });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update image' });
        }
    };

    getPublicUsers = async (req, res) => {
        try {
            const users = await userDal.getAllPublicUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch public users' });
        }
    };

    getPublicUserContent = async (req, res) => {
        try {
            const { target_user_id } = req.params;

            // Check if user is public first
            const user = await userDal.userByToken(target_user_id);
            if (!user || !user.is_public) {
                return res.status(403).json({ message: 'Este perfil es privado' });
            }

            const notes = await noteDal.getNotesByDateRange(target_user_id, '1970-01-01', '2100-01-01');
            const habits = await habitDal.getHabitsByUserId(target_user_id);
            
            // Fetch moods safely
            let userMoods = {};
            try {
                const moodsData = await moodDal.getMoodsByUserId(target_user_id);
                userMoods = formatMoods(moodsData);
            } catch (mErr) {
                console.error("Non-critical: Failed to load moods for public user", mErr);
            }

            res.status(200).json({ 
                user: { id: user.id, name: user.name, created_at: user.created_at, image: user.image },
                notes,
                habits,
                moods: userMoods
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch user content' });
        }
    };
}

export default new UserController();