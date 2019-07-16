var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var csrf = require('csurf');
var api = require('./routes/api');
var app = express();

mongoose.Promise = require('bluebird');
mongoose.set('debug', true);
//mongoose.set('diagnosticDataCollectionEnabled', false)
mongoose.connect(config.database, {useNewUrlParser: true, promiseLibrary: require('bluebird')})
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

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

module.exports = app;