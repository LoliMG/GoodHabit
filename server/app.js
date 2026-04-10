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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes app
app.use('/api/user', userRouter);
app.use('/api/habit', habitRouter);
app.use('/api/progress', progressRouter);
app.use('/api/note', noteRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).json(err);
});

export default app;
