// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import { join } from 'path';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var logger = require('morgan');
var createError = require('http-errors');

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Express server
const app = express();
var api = require('./routes/api');

// MongoDB config
mongoose.Promise = require('bluebird');
mongoose.set('debug', true);
mongoose.connect(config.database, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use('/api', api);

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Implement data requests securely
// catch 404 and forward to error handler
app.get('/api/**', function(req, res, next) {
  next(createError(404));
});
// error handler
app.get('/api/**',function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.sendStatus(err.status);
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'),{
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  console.log(`URL: ${req.url}`);
  // Set cache control headers
  res.set({
    'Cache-Control': 'public, max-age=31557600'
  });
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log('Node server listening on http://localhost:' + PORT);
});