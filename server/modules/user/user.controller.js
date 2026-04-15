import { hashPassword, comparePassword } from '../../utils/bcryptUtils.js';
import { generateToken, generateResetToken, verifyResetToken } from '../../utils/jwtUtils.js';
import { sendResetPasswordEmail } from '../../utils/emailService.js';
import userDal from './user.dal.js';
import habitDal from '../habit/habit.dal.js';
import progressDal from '../progress/progress.dal.js';
import noteDal from '../note/note.dal.js';
import moodDal from '../mood/mood.dal.js';
import { supabase } from '../../config/supabase.js';

// Helper ultra-seguro para moods
const formatMoods = (moods) => {
    if (!Array.isArray(moods)) return {};
    return moods.reduce((acc, current) => {
        if (current && current.date && current.emoji) {
            acc[current.date] = current.emoji;
        }
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
                return res.status(401).json({ message: 'Datos incorrectos' });
            }

            let match = await comparePassword(password, result[0].password);
            if (!match) {
                return res.status(401).json({ message: 'Datos incorrectos' });
            }

            const userId = result[0].id;
            const token = generateToken(userId);
            
            // Carga de datos asociada al usuario
            const habits = await habitDal.getHabitsByUserId(userId);
            const oneTimeHabits = await habitDal.getOneTimeHabits(userId); 
            const progress = await progressDal.getProgressByDateRange(userId, '1970-01-01', '2100-01-01');
            const notes = await noteDal.getNotesByDateRange(userId, '1970-01-01', '2100-01-01');
            
            // Moods cargados con seguridad total
            let userMoods = {};
            try {
                const moodsData = await moodDal.getMoodsByUserId(userId);
                userMoods = formatMoods(moodsData);
            } catch (mErr) {
                console.error("Fallo no crítico al cargar moods en login:", mErr);
            }

            res.status(200).json({ 
                message: 'Login successful', 
                token, 
                user: { 
                    id: userId, 
                    name: result[0].name, 
                    email: result[0].email, 
                    is_public: result[0].is_public, 
                    image: result[0].image || null 
                },
                habits,
                oneTimeHabits,
                progress,
                notes,
                moods: userMoods
            });
        } catch (error) {
            console.error("ERROR CRÍTICO EN LOGIN:", error);
            res.status(500).json({ message: 'Error interno en el servidor al iniciar sesión' });
        }
    };

    userByToken = async (req, res) => {
        const { user_id } = req;
        try {
            const user = await userDal.userByToken(user_id);
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

            const habits = await habitDal.getHabitsByUserId(user_id);
            const oneTimeHabits = await habitDal.getOneTimeHabits(user_id);
            const progress = await progressDal.getProgressByDateRange(user_id, '1970-01-01', '2100-01-01');
            const notes = await noteDal.getNotesByDateRange(user_id, '1970-01-01', '2100-01-01');
            
            let userMoods = {};
            try {
                const moodsData = await moodDal.getMoodsByUserId(user_id);
                userMoods = formatMoods(moodsData);
            } catch (mErr) {
                console.error("Fallo no crítico en userByToken:", mErr);
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
            console.error("ERROR EN USERBYTOKEN:", error);
            res.status(500).json({ error: 'Fallo al recuperar usuario por token' });
        }
    };

    googleLogin = async (req, res) => {
        try {
            const { access_token } = req.body;
            if (!access_token) return res.status(400).json({ message: 'Token de Google no proporcionado' });

            const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            if (!googleRes.ok) return res.status(401).json({ message: 'Token de Google inválido' });

            const userInfo = await googleRes.json();
            const { email, name, sub: googleId } = userInfo;

            let result = await userDal.findUserByEmail(email);
            let userId, userName, userEmail, userImage;

            if (result.length === 0) {
                let hashedPass = await hashPassword(googleId || 'google_auth_placeholder');
                let insertResult = await userDal.register([name, email, hashedPass]);
                userId = insertResult[0].user_id;
                userName = name;
                userEmail = email;
                userImage = null;
            } else {
                userId = result[0].id;
                userName = result[0].name;
                userEmail = result[0].email;
                userImage = result[0].image || null;
            }

            const token = generateToken(userId);
            const habits = await habitDal.getHabitsByUserId(userId);
            const oneTimeHabits = await habitDal.getOneTimeHabits(userId); 
            const progress = await progressDal.getProgressByDateRange(userId, '1970-01-01', '2100-01-01');
            const notes = await noteDal.getNotesByDateRange(userId, '1970-01-01', '2100-01-01');

            let userMoods = {};
            try {
                const moodsData = await moodDal.getMoodsByUserId(userId);
                userMoods = formatMoods(moodsData);
            } catch (mErr) {
                console.error("Fallo no crítico en googleLogin:", mErr);
            }

            res.status(200).json({ 
                message: 'Google Login successful', 
                token, 
                user: { 
                    id: userId, name: userName, email: userEmail, 
                    is_public: result.length === 0 ? false : result[0].is_public,
                    image: userImage
                },
                habits, oneTimeHabits, progress, notes, moods: userMoods
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
            
            const fileExt = req.file.originalname.split('.').pop();
            const fileName = `${user_id}-${Date.now()}.${fileExt}`;
            const filePath = `users/${fileName}`;

            if (!supabase || !supabase.storage) throw new Error("Supabase no configurado para subida de imágenes");

            const { data, error } = await supabase.storage
                .from('images')
                .upload(filePath, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
            
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
            const user = await userDal.userByToken(target_user_id);
            
            if (!user || !user.is_public) {
                return res.status(403).json({ message: 'Este perfil es privado' });
            }

            const notes = await noteDal.getNotesByDateRange(target_user_id, '1970-01-01', '2100-01-01');
            const habits = await habitDal.getHabitsByUserId(target_user_id);
            
            // Protección contra Supabase Mock o errores
            const notesWithLikes = await Promise.all(notes.map(async (note) => {
                let likesCount = 0;
                let likedByUser = false;

                try {
                    if (supabase && typeof supabase.from === 'function') {
                        const { count } = await supabase
                            .from('note_likes')
                            .select('*', { count: 'exact', head: true })
                            .eq('note_id', note.id);
                        likesCount = count || 0;

                        if (req.user_id) {
                            const { data } = await supabase
                                .from('note_likes')
                                .select('*')
                                .eq('note_id', note.id)
                                .eq('user_id', req.user_id);
                            likedByUser = data && data.length > 0;
                        }
                    }
                } catch (sErr) {
                    console.error("Fallo silencioso en fetch de likes:", sErr);
                }

                return { ...note, likes_count: likesCount, liked_by_user: likedByUser };
            }));

            let userMoods = {};
            try {
                const moodsData = await moodDal.getMoodsByUserId(target_user_id);
                userMoods = formatMoods(moodsData);
            } catch (mErr) {
                console.error("Fallo al cargar moods públicos:", mErr);
            }

            res.status(200).json({ 
                user: { id: user.id, name: user.name, created_at: user.created_at, image: user.image },
                notes: notesWithLikes,
                habits,
                moods: userMoods
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch user content' });
        }
    };

    forgotPassword = async (req, res) => {
        const { email } = req.body;
        try {
            const result = await userDal.findUserByEmail(email);
            if (result.length === 0) return res.status(200).json({ message: 'Enlace enviado si el correo existe' });

            const token = generateResetToken(result[0].id);
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
            await sendResetPasswordEmail(email, resetLink);
            res.status(200).json({ message: 'Email enviado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error en recuperación' });
        }
    };

    resetPassword = async (req, res) => {
        const { token, newPassword } = req.body;
        try {
            const decoded = verifyResetToken(token);
            if (!decoded) return res.status(401).json({ message: 'Token inválido' });

            const hashedPass = await hashPassword(newPassword);
            await userDal.updatePassword(hashedPass, decoded.user_id);
            res.status(200).json({ message: 'Contraseña actualizada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar contraseña' });
        }
    };
}

export default new UserController();