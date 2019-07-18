/*
 *  Sample URL filter to log all the incoming requests to console
 *  For more information on Middleware visit: http://expressjs.com/api.html#middleware
 */
'use strict';
// var logger = require('morgan');
let logger = require('../../config/winston');

module.exports = function(req, res, next) {
  // logger.audit('IN METHOD application.middleware.log - RECEIVED request: ' + req.url);
  logger.info('IN METHOD application.middleware.log - RECEIVED request: ' + req.url);
  // console.log('IN METHOD application.middleware.log - RECEIVED request: ' + req.url);
  next();
};