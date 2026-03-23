// src/server.ts
import 'dotenv/config';
import app from './app.js';
import { prisma } from './lib/prisma.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1. Verify Database Connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // 2. Start Express Listener
    app.listen(PORT, () => {
      console.log(`
🚀 Server is running!
📡 URL: http://localhost:${PORT}
🛠️ Health Check: http://localhost:${PORT}/health
      `);
    });
     
  } catch (error) {
    console.error('❌ Error starting server:', error);

    await prisma.$disconnect();
    process.exit(1);

  }
}
// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason) => {
});
startServer();