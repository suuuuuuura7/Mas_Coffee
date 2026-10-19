import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

// credentials: true + an explicit origin (not "*") is required so the browser
// will actually send/receive the httpOnly auth cookie across domains
// (your Vercel frontend calling your Render backend).
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('MAS COFFEE API is running.'));

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required.');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required.');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  console.log('Connected to MongoDB');

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

startServer().catch((err) => {
  console.error('Failed to start API server:', err.message);
  process.exit(1);
});