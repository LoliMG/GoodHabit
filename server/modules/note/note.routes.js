import express from 'express';
import noteController from './note.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post('/save', verifyToken, noteController.saveNote);
router.delete('/delete', verifyToken, noteController.deleteNote);

export default router;
