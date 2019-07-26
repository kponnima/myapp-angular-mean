/*
 *  Module which handles the common functions.
 *  Re-usable utility functions
 */
'use strict';
const {createLogger, transports, format} = require('winston');

const logger = createLogger({
  format: format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: './logs/app.log',
      json: false,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console({
      format: format.simple()
    })
  ]
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);    
  }
};

module.exports = logger;