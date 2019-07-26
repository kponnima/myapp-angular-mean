/*
 *  Controller which handles api requests coming from the router.
 *  Airport API request controller
 */
'use strict';
const Aircraft = require('../models/Aircraft');
const utils = require('../lib/utils');

/* GET AIRCRAFTS for ADMIN*/
async function getAllAircrafts(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Aircraft.find({
    }, async (err, aircrafts) => {
      if (err) return await next(err);
      if (!aircrafts) {
        return await res.status(401).send({success: false, msg: 'Authentication failed!'});
      } else {
        // get the list of aircrafts
        return await res.json(aircrafts);
      }
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* SAVE AIRCRAFT */
async function createAircraft(req, res) {
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

    newAircraft.save(async (err) => {
      if (err) {
        return await res.json({success: false, msg: 'Save aircraft failed.'});
      }
      return await res.json({success: true, msg: 'Successful created new aircraft.'});
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* GET SINGLE AIRCRAFT BY ID */
async function getAircraftDetail(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Aircraft.find(
      {aircraft_no: req.params.aircraft_no}
      , async (err, aircraft) => {
        if (err) return await next(err);
        if (!aircraft) {
          return await res.status(403).send({success: false, msg: 'Search failed. Aircraft not found.'});
        } else {
          return await res.json(aircraft);
        }
      });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* UDPATE FLIGHT */
async function updateAircraft(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Aircraft.findOneAndUpdate(
      req.params.aircraft_no, req.body
      , async (err, aircraft) => {
        if (err) return await next(err);
        return await res.json(aircraft);
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* DELETE FLIGHT */
async function deleteAircraft(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Aircraft.findOneAndRemove(
      {'aircraft_no': req.params.aircraft_no}, async (err) => {
        if (err) return await next(err);
        return await res.status(200).send({success: true, msg: 'Sucessfully deleted !'});
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

module.exports = {
  getAllAircrafts: getAllAircrafts,
  getAircraftDetail: getAircraftDetail,
  createAircraft: createAircraft,
  updateAircraft: updateAircraft,
  deleteAircraft: deleteAircraft
}