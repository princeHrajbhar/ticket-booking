import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app: Application = express();

// --- 1. Global Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. Compute __dirname equivalent for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 3. Swagger UI ---
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- 4. Routes ---
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// --- 5. Root & Health ---
app.get("/", (req, res) => res.json({ message: "API is running 🚀" }));
app.get('/health', (req, res) => res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() }));

// --- 6. Global 404 Handler ---
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

export default app;