/*
 *  Module which handles the application serve operations.
 */
'use strict';
let express = require('express'),
  passport = require('passport'),
  morgan = require('morgan'),
  cors = require('cors'),
  path = require('path'),
  createError = require('http-errors'),
  csrf = require('csurf'),
  debug = require('debug'),
  http = require('http'),  
  api = require('../../application/routes/api'),
  app = express();
let applicationReady = false;

// Main application function
async function serveApplication() {
  logger.info('METHOD ENTRY - application.lib.app.serveApplication');
  // Get port from environment and store in Express.
  let PORT = process.env.PORT || '3000';
  await app.set('port', PORT);
  await app.use(passport.initialize());
  await app.use(morgan('combined', {stream: logger.stream}));
  await app.use(cors());
  await app.use(express.json());
  await app.use(express.urlencoded({extended: false}));
  await app.use(express.static(path.join(__dirname, 'dist/myApp')));
  await app.use('/', express.static(path.join(__dirname, 'dist/myApp')));
  await app.use('/api', api);

  // catch 404 and forward to error handler
  await app.use(async (req, res, next) => {
    await next(createError(404));
  });
  // Set cookie to no-cache
  await app.use(async (req, res, next) => {
    await res.set('Cache-Control', 'no-cache="Set-Cookie"');
    next();
  });
  // Set csrf cookie
  await app.use(csrf({
    cookie: {
      httpOnly: true,
      secure: true
    },
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
  }));

  //Set the XSRF cookie if its not present
  await app.use(async (req, res, next) => {
    req.cookies['XSRF-TOKEN'] ? null : res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: true, httpOnly: true});
    next();
  });
  // error handler for CSRF
  await app.use(async (err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
      return next(err);
    }
    // handle CSRF token errors here
    await res.status(403);
    await res.send('session has expired or form tampered with');
  });

  // error handler
  await app.use(async (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //include winston logging
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // render the error page
    await res.status(err.status || 500);
    await res.sendStatus(err.status);
  });

  // start the server in the port 3000 !
  await app.listen(PORT, function () {
    logger.info('Application started on port: ' + PORT);
  });
  applicationReady = true;
  logger.info('METHOD EXIT - application.lib.app.serveApplication');
  return applicationReady;
}

module.exports = {
  serveApplication: serveApplication
}