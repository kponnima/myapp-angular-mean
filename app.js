var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var csrf = require('csurf');
var api = require('./application/routes/api');
var app = express();
var debug = require('debug');
var http = require('http');
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Node server listening on http://localhost:' + bind);
}

mongoose.Promise = global.Promise;
mongoose.set('debug', true);
//mongoose.set('diagnosticDataCollectionEnabled', false)
mongoose.connect(config.database, {useNewUrlParser: true})
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'dist/myApp')));
app.use('/', express.static(path.join(__dirname, 'dist/myApp')));
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Set cookie to no-cache
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache="Set-Cookie"');
  next();
});

app.use(csrf({
  cookie: {
    httpOnly: true,
    secure: true
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS']
}));

//Set the XSRF cookie if its not present
app.use(function(req, res, next) {
  req.cookies['XSRF-TOKEN'] ? null : res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: true, httpOnly: true});
  next();
});
// error handler for CSRF
app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  // handle CSRF token errors here
  res.status(403);
  res.send('session has expired or form tampered with');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendStatus(err.status);
});

/**
 * Create HTTP server.
 */
var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = app;