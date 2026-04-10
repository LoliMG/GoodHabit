import express from 'express';
import progressController from './progress.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post('/toggle', verifyToken, progressController.toggle);
router.get('/range', verifyToken, progressController.getByRange);
router.get('/stats/:habitId', verifyToken, progressController.getStats);

export default router;
