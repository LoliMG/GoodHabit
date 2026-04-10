import express from 'express';
import moodController from './mood.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post('/save', verifyToken, moodController.updateMood);
router.delete('/:date', verifyToken, moodController.deleteMood);

export default router;
