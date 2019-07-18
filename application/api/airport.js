/*
 *  Controller which handles api requests coming from the router.
 *  Airport API request controller
 */
'use strict';
const Airport = require('../models/Airport');
const utils = require('../lib/utils');

/* GET AIRPORTS for ADMIN && HOME */
async function getAllAirports(req, res) {
  var token = utils.getToken(req.headers);
  if (token) {
    Airport.find({
    }, async (err, airports) => {
      if (err) return await next(err);
      if (!airports) {
        return await res.status(401).send({success: false, msg: 'Authentication failed!'});
      } else {
        // get the list of airports
        return await res.json(airports);
      }
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* SAVE AIRPORT */
async function createAirport(req, res) {
  var token = await utils.getToken(req.headers);
  if (token) {
    var newAirport = new Airport({
      airportcode: req.body.airportcode,
      airportname: req.body.airportname,
      cityname: req.body.cityname,
      countrycode: req.body.countrycode,
      countryname: req.body.countryname
    });

    newAirport.save(function(err) {
      if (err) {
        return await res.json({success: false, msg: 'Save airport failed.'});
      }
      return await res.json({success: true, msg: 'Successful created new airport.'});
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* GET SINGLE AIRPORT BY ID */
async function getAirportDetail(req, res) {
  var token = await utils.getToken(req.headers);
  if (token) {
    Airport.find(
      {airportcode: req.params.airportcode}
      , async (err, airport) => {
        if (err) return await next(err);
        if (!airport) {
          return await res.status(403).send({success: false, msg: 'Search failed. Airport not found.'});
        } else {
          return await res.json(airport);
        }
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* UDPATE AIRPORT */
async function updateAirport(req, res) {
  var token = await utils.getToken(req.headers);
  if (token) {
    Airport.findOneAndUpdate(
      req.params.airportcode, req.body
      , async (err, airport) => {
        if (err) return await next(err);
        return await res.json(airport);
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* DELETE AIRPORT */
async function deleteAirport(req, res) {
  var token = await utils.getToken(req.headers);
  if (token) {
    Airport.findOneAndRemove(
      req.params.airportcode, async (err) => {
        if (err) return await next(err);
        return await res.status(200).send({success: true, msg: 'Sucessfully deleted !'});
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

module.exports = {
  getAirport: getAirport,
  getAllAirports: getAllAirports,
  getAirportDetail: getAirportDetail,
  createAirport: createAirport,
  updateAirport: updateAirport,
  deleteAirport: deleteAirport
}