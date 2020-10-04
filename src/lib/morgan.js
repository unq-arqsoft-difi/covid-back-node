require('dotenv').config();
const { loggers, format, transports } = require('winston');

const logPath = 'logs/';
const logName = process.env.LOG_NAME || 'covid';

loggers.add('morganAccess', {
  format: format.simple(),
  transports: [new transports.File({ filename: `${logPath}/${logName}_access.log` })],
});

loggers.add('morganAccessMs', {
  format: format.simple(),
  transports: [new transports.File({ filename: `${logPath}/${logName}_access_ms.log` })],
});

module.exports = {
  morganAccess: loggers.get('morganAccess'),
  morganAccessMs: loggers.get('morganAccessMs'),
};
