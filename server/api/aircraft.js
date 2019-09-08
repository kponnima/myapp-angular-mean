/*
 *  Controller which handles api requests coming from the router.
 *  Airport API request controller
 */
'use strict';
const Aircraft = require('../models/Aircraft');
const utils = require('../lib/utils');

/* GET AIRCRAFTS for ADMIN*/
async function getAllAircrafts(req, res) {
  logger.info('METHOD ENTRY - server.api.aircraft.getAllAircrafts');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    await Aircraft.find({
    }, async (err, aircrafts) => {
      if (err) {
        logger.error('ERROR IN METHOD - server.api.aircraft.getAllAircrafts - failed with error: ' + err);
        return await next(err);
      }
      if (!aircrafts) {
        logger.error('ERROR IN METHOD - server.api.aircraft.getAllAircrafts - no records found in db');
        return await res.status(401).send({ success: false, msg: 'no records found!' });
      } else {
        // get the list of aircrafts
        logger.info('METHOD EXIT - server.api.aircraft.getAllAircrafts - successfully fetched records from db');
        return await res.json(aircrafts);
      }
    });
  } else {
    logger.error('ERROR IN METHOD - server.api.aircraft.getAllAircrafts - unauthorized to fetch records from db');
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* SAVE AIRCRAFT */
async function createAircraft(req, res) {
  logger.info('METHOD ENTRY - server.api.aircraft.createAircraft');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    let newAircraft = new Aircraft({
      aircraft_no: req.body.aircraft_no,
      aircraft_id: req.body.aircraft_id,
      aircraftname: req.body.aircraftname,
      carrier: req.body.carrier,
      inventory_id: req.body.inventory_id,
      equipment_Id: req.body.equipment_Id
    });

    await newAircraft.save(async (err) => {
      if (err) {
        logger.error('ERROR IN METHOD - server.api.aircraft.createAircraft - failed with error: ' + err);
        return await res.json({ success: false, msg: 'Save aircraft failed.' });
      }
      logger.info('METHOD EXIT - application.lib.app.serveApplication - successfully inserted record to db');
      return await res.json({ success: true, msg: 'Successful created new aircraft.' });
    });
  } else {
    logger.error('ERROR IN METHOD - server.api.aircraft.createAircraft - unauthorized to insert record to db');
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* GET SINGLE AIRCRAFT BY ID */
async function getAircraftDetail(req, res) {
  logger.info('METHOD ENTRY - server.api.aircraft.getAircraftDetail');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Aircraft.find(
      { aircraft_no: req.params.aircraft_no }
      , async (err, aircraft) => {
        if (err) {
          logger.error('ERROR IN METHOD - server.api.aircraft.getAircraftDetail - failed with error: ' + err);
          return await next(err);
        }
        if (!aircraft) {
          logger.error('ERROR IN METHOD - server.api.aircraft.getAircraftDetail - no records found in db');
          return await res.status(403).send({ success: false, msg: 'Search failed. Aircraft not found.' });
        } else {
          logger.info('METHOD EXIT - server.api.aircraft.getAircraftDetail - successfully fetched records from db');
          return await res.json(aircraft);
        }
      });
  } else {
    logger.error('ERROR IN METHOD - server.api.aircraft.getAircraftDetail - unauthorized to fetch records from db');
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* UDPATE FLIGHT */
async function updateAircraft(req, res) {
  logger.info('METHOD ENTRY - server.api.aircraft.updateAircraft');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Aircraft.findOneAndUpdate(
      req.params.aircraft_no, req.body
      , async (err, aircraft) => {
        if (err) {
          logger.error('ERROR IN METHOD - server.api.aircraft.updateAircraft - failed with error: ' + err);
          return await next(err);
        }
        logger.info('METHOD EXIT - server.api.aircraft.updateAircraft - successfully updated record in db');
        return await res.json(aircraft);
      });
  } else {
    logger.error('ERROR IN METHOD - server.api.aircraft.updateAircraft - unauthorized to update record in db');
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* DELETE FLIGHT */
async function deleteAircraft(req, res) {
  logger.info('METHOD ENTRY - server.api.aircraft.deleteAircraft');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Aircraft.findOneAndRemove(
      { 'aircraft_no': req.params.aircraft_no }, async (err) => {
        if (err) {
          logger.error('ERROR IN METHOD - server.api.aircraft.deleteAircraft - failed with error: ' + err);
          return await next(err);
        }
        logger.info('METHOD EXIT - server.api.aircraft.deleteAircraft - successfully deleted record in db');
        return await res.status(200).send({ success: true, msg: 'Sucessfully deleted !' });
      });
  } else {
    logger.error('ERROR IN METHOD - server.api.aircraft.deleteAircraft - unauthorized to delete record in db');
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}

module.exports = {
  getAllAircrafts: getAllAircrafts,
  getAircraftDetail: getAircraftDetail,
  createAircraft: createAircraft,
  updateAircraft: updateAircraft,
  deleteAircraft: deleteAircraft
}