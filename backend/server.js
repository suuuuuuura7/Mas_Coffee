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

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is unavailable. Check the Render MONGODB_URI and MongoDB Atlas Network Access settings.',
    });
  }
  next();
}

app.use('/api/products', requireDatabase, productRoutes);
app.use('/api/auth/login', requireDatabase);
app.use('/api/auth/change-password', requireDatabase);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('MAS COFFEE API is running.'));

const PORT = process.env.PORT || 5000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectToMongo() {
  let retryDelay = 5000;

  while (mongoose.connection.readyState !== 1) {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is required. Database requests will be unavailable.');
      return;
    }

    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error(`MongoDB connection failed: ${err.message}`);
      console.warn(`Retrying MongoDB connection in ${retryDelay / 1000} seconds.`);
      await sleep(retryDelay);
      retryDelay = Math.min(retryDelay * 2, 60000);
    }
  }
}

async function startServer() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is required for admin authentication.');
  }

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  await connectToMongo();
}

startServer().catch((err) => {
  console.error('Unexpected API server error:', err.message);
  process.exit(1);
});