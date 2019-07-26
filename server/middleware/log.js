/*
 *  Sample URL filter to log all the incoming requests to log file
 *  For more information on Middleware visit: http://expressjs.com/api.html#middleware
 */
'use strict';

module.exports = function(req, res, next) {  
  logger.info('IN METHOD application.middleware.log - RECEIVED request: ' + req.url);  
  next();
};