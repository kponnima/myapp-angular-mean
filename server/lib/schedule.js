/*
 *  Module which handles the schedule functions.
 */

let cron = require('node-cron'),
  moment = require('moment'),
  db = require('./db'),
  dbRecords = require('../db/db-setup-script');

async function schedule(cb) {
  await logger.info('METHOD ENTRY - application.lib.schedule');

  return await cron.schedule('*/30 * * * * ', async () => {
    logger.info('Running a task every 30 minutes');
    await Object.keys(dbRecords.flights).forEach(key => {
      dbRecords.flights[key].departureDate = moment(new Date()).add(1, 'days').toISOString();
      dbRecords.flights[key].arrivalDate = moment(new Date()).add(1, 'days').toISOString();
      db.updateCollection('flights', { 'flight_no': dbRecords.flights[key].flight_no } , dbRecords.flights[key]);
    });
    await logger.info('METHOD EXIT - application.lib.schedule');
  });
}

module.exports = {
  schedule: schedule
}
