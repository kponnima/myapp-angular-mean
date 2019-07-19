/*
 *  Main module which handles application backend.
 */
'use strict';
let async = require('async'),
  logger = require('./config/winston'),
  db = require('./application/lib/db'),
  app = require('./application/lib/app');

global.logger = logger;

// main function
async function main() {
  async.waterfall([
    async function(callback) {
      await db.connectToMongo(function(err) {
        if (err) {
          return callback('Mongo connection not established');
        }
        return callback();
      });
    },
    async function(callback) {
      await app.serveApplication(function(err) {
        if (err) {
          return callback('Application is not ready');
        }
        return callback();
      });
    },
    async function(callback) {
      await db.setupDb(function(err) {
        if (err) {
          return callback('Mongo db is not setup');
        }
        return callback();
      });
    }
  ], async function(err) {
    if (err) {
      await handleShutDown(err);
      await logger.error('Failed to start application....' + err);
      return;
    }
    await logger.info('Application ready in ....' + process.env.NODE_ENV);
  });
}
// handle error on startup
async function handleShutDown(err) {
  await db.closeConnection();
  await setTimeout(() => process.exit(err ? 500 : 0), 500);
}
// handle shutdown
process.on('SIGINT', () => handleShutDown());

//start application, handle error on startup
main();

module.exports = app;