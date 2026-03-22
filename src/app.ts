import express, { Application } from 'express';
import cors from 'cors';
import logger from './../lib/logger.js'; // Import your Winston logger
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';


const app: Application = express();

// --- 1. Global Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// --- 3. Routes ---
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/', bookingRoutes);

// --- 4. Health Check ---
app.get('/health', (req, res) => {
  logger.info("Health check endpoint accessed");
  res.status(200).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString() 
  });
});

// --- 5. Global 404 Handler ---
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found" });
});

export default app;