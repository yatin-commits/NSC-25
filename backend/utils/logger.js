const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Use 'info' in production to exclude debug logs
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new transports.Console(), 
    
    new transports.File({ filename: path.join('/tmp', 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join('/tmp', 'combined.log') })
  ],
});



module.exports = logger;