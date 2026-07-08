import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import dns from 'dns';
import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

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

// Start server immediately — don't wait for DB
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// Connect to MongoDB separately (non-blocking)
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.warn('Server is still running, but DB features will not work.');
  });