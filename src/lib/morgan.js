require('dotenv').config();
const { loggers, format, transports } = require('winston');

const logPath = 'logs/';
const logName = process.env.LOG_NAME || 'covid';

loggers.add('morgan', {
  format: format.simple(),
  transports: [new transports.File({ filename: `${logPath}/${logName}_access.log` })],
});

module.exports = loggers.get('morgan');
