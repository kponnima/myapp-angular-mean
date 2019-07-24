/*
 *  Main module which handles application backend.
 */
'use strict';
let async = require('async'),
  logger = require('./application/middleware/winston'),
  db = require('./application/lib/db'),
  app = require('./application/lib/app'),
  batch = require('./application/lib/schedule');

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

// async function main() {
//   await logger.info('METHOD ENTRY - app.main');

//   async.waterfall([
//     async function () {
//       await db.connectToMongo(function (err) {
//         if (err) {
//           return err;
//         }
//         return;
//       });
//     },
//     async function () {
//       await app.serveApplication(function (err) {
//         if (err) {
//           return err;
//         }
//         return;
//       });
//     },
//     async function () {
//       await db.setupDb(function (err) {
//         if (err) {
//           return err;
//         }
//         return;
//       });
//     }
//   ],
//     async function (err) {
//       if (err) {
//         await handleShutDown(err);
//         await logger.error('Failed to start application....' + err);
//         return err;
//       } else {
//         await logger.info('Application ready in ....' + process.env.NODE_ENV);
//         return;
//       }
//     });
//   await logger.info('METHOD EXIT - app.main');
// }

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