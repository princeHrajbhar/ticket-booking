import winston from 'winston';
import path from 'path';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message} `;
    if (Object.keys(metadata).length > 0) {
      msg += JSON.stringify(metadata);
    }
    return msg;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    // 1. Write all logs to console
    new winston.transports.Console(),
    // 2. Write all logs to a file
    new winston.transports.File({ 
      filename: path.join('logs', 'app.log'),
      level: 'info' 
    }),
    // 3. Write errors specifically to a separate file
    new winston.transports.File({ 
      filename: path.join('logs', 'error.log'), 
      level: 'error' 
    }),
  ],
});

export default logger;