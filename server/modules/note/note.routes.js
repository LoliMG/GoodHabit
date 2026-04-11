import express from 'express';
import noteController from './note.controller.js';
import noteLikesController from './note_likes.controller.js';
import { verifyToken, optionalVerifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.post('/save', verifyToken, noteController.saveNote);
router.delete('/delete', verifyToken, noteController.deleteNote);

// Like endpoints
router.put('/likes/:note_id', verifyToken, noteLikesController.toggleLike);
router.post('/likes', optionalVerifyToken, noteLikesController.getNoteLikes);

export default router;
