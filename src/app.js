import express from 'express';
import textRoutes from './routes/textRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/AppError.js';

const app = express();

app.use(express.json());

// Routes
app.use('/', textRoutes);
app.use('/', imageRoutes);
app.use('/', documentRoutes);
app.use('/', audioRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
