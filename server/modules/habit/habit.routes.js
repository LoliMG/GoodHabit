import express from 'express';
import habitController from './habit.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, habitController.getHabits);
router.post('/add', verifyToken, habitController.createHabit);
router.put('/update', verifyToken, habitController.updateHabit);
router.delete('/:id', verifyToken, habitController.deleteHabit);

// One-Time
router.get('/one-time', verifyToken, habitController.getOneTime);
router.post('/one-time', verifyToken, habitController.createOneTime);
router.put('/one-time/:id', verifyToken, habitController.toggleOneTime);
router.delete('/one-time/:id', verifyToken, habitController.deleteOneTime);

export default router;
