/*
 *  Main module which handles application backend.
 */
'use strict';
let logger = require('./server/middleware/winston'),
  db = require('./server/lib/db'),
  app = require('./server/lib/app'),
  batch = require('./server/lib/schedule');

global.logger = logger;
let task;

// main function

async function main() {
  //Setup the application server start up tasks
  try {
    await db.connectToMongo();
    await app.serveApplication();
    await db.setupDb();
    // Setup the batch job to update flight records daily
    task = await batch.schedule();
    await task.start();
    await logger.info('Application ready in ....' + process.env.NODE_ENV);
  } catch (err) {
    await logger.error('Failed to start application....');
    await handleShutDown();
  }
}

// handle error on startup
async function handleShutDown() {
  await db.closeConnection();
  await setTimeout(() => process.exit(500));
  if (task) await task.stop();
}
// handle shutdown
process.on('SIGINT', () => handleShutDown());

//start application, handle error on startup
main();

module.exports = app;