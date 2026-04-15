import express from 'express';
import userController from './user.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { uploadImage } from '../../middlewares/multer.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/googleLogin', userController.googleLogin);
router.get('/userByToken', verifyToken, userController.userByToken);
router.put('/editUser', verifyToken, userController.editUser);
router.put('/editImage', verifyToken, uploadImage('users'), userController.editImage);
router.get('/public-users', userController.getPublicUsers);
router.get('/public-user/:target_user_id', optionalVerifyToken, userController.getPublicUserContent);

export default router;