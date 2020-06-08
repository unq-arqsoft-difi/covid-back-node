require('dotenv').config();

const { inspect } = require('util');
const { createLogger, format, transports } = require('winston');

const logPath = 'logs/';
const logName = process.env.LOG_NAME || 'covid';
const logLevel = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: logName },
  transports: [
    new transports.File({ filename: `${logPath}/${logName}_error.log`, level: 'error' }),
    new transports.File({ filename: `${logPath}/${logName}_all.log` }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: format.combine(
        format.splat(),
        format.colorize(),
        format.printf((error) => {
          const message = error.stack ? error.stack : error.message;
          return `${error.level}: ${inspect(message, { showHidden: true, depth: null, colors: true })}`;
        }),
      ),
    }),
  );
}

module.exports = logger;
