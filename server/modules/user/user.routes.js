import express from 'express';
import userController from './user.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/googleLogin', userController.googleLogin);
router.get('/userByToken', verifyToken, userController.userByToken);
router.put('/editUser', verifyToken, userController.editUser);
router.get('/public-users', userController.getPublicUsers);
router.get('/public-user/:target_user_id', userController.getPublicUserContent);

export default router;