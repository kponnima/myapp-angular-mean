/*
 *  Module which handles the schedule functions.
 */

let cron = require('node-cron'),
  moment = require('moment'),
  db = require('./db'),
  dbRecords = require('../../db/db-setup-script');

async function schedule(cb) {
  await logger.info('METHOD ENTRY - application.lib.schedule');

  var flightRecord;

  return await cron.schedule('* * * * * ', async () => {
    logger.info('Running a task every 1 minute');
    await Object.keys(dbRecords.flights).forEach(key => {
      dbRecords.flights[key].departureDate = moment(new Date()).add(1, 'days').toISOString();
      dbRecords.flights[key].arrivalDate = moment(new Date()).add(1, 'days').toISOString();
      db.updateCollection('flights', { 'flight_no': dbRecords.flights[key].flight_no } , dbRecords.flights[key]);
    });
  });
}

module.exports = {
  schedule: schedule
}
