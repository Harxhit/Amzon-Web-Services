import { createLogger, format, transports } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

const { combine, timestamp, printf, errors, colorize } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// MAIN LOGGER
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    customFormat
  ),
  transports: [
    // Local + production file logging
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// ---------- CLOUDWATCH LOGGING (ONLY IF ENABLED) ----------
if (process.env.ENABLE_CLOUDWATCH === 'true') {
  logger.add(
    new WinstonCloudWatch({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP || 'crudder-backend-logs',
      logStreamName:
        process.env.CLOUDWATCH_LOG_STREAM ||
        process.env.HOSTNAME ||
        'backend-stream',

      awsRegion: process.env.AWS_REGION,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,

      jsonMessage: true,
    })
  );
}

// ---------- CONSOLE LOGGING (LOCAL ONLY) ----------
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
    })
  );
}

export default logger;
