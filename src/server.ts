// src/server.ts
import 'dotenv/config';
import app from './app';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1. Verify Database Connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    console.log('✅ Database connected successfully');

    // 2. Start Express Listener
    app.listen(PORT, () => {
      console.log(`
🚀 Server is running!
📡 URL: http://localhost:${PORT}
🛠️ Health Check: http://localhost:${PORT}/health
      `);
    });
        logger.info(`🚀 Server is running!`, {
        url: `http://localhost:${PORT}`,
        healthCheck: `http://localhost:${PORT}/health`,
        environment: process.env.NODE_ENV || 'development'
      });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    logger.error('❌ Error starting server', { 
      error: error instanceof Error ? error.message : error 
    });
    await prisma.$disconnect();
    process.exit(1);

  }
}
// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection at Promise', { reason });
});
startServer();