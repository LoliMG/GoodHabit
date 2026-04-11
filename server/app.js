import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Routes import
import userRouter from "./modules/user/user.routes.js";
import habitRouter from "./modules/habit/habit.routes.js";
import progressRouter from "./modules/progress/progress.routes.js";
import noteRouter from "./modules/note/note.routes.js";
import moodRouter from "./modules/mood/mood.routes.js";

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet()); // Sets various security headers
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Restrict to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes app
app.use('/api/user', userRouter);
app.use('/api/habit', habitRouter);
app.use('/api/progress', progressRouter);
app.use('/api/note', noteRouter);
app.use('/api/mood', moodRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json(err);
});

export default app;
