/*
 *  Controller which handles api requests coming from the router.
 *  Flight API request controller
 */
'use strict';
const Flight = require('../models/Flight');
const utils = require('../lib/utils');
const mongoose = require('mongoose');
const moment = require('moment');

/* GET ALL FLIGHTS data */
async function getAllFlights(req, res) {
  logger.info('METHOD ENTRY - server.api.flight.getAllFlights');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Flight.find({
    }, async (err, flights) => {
      if (err) {
        logger.error('ERROR IN METHOD - server.api.flight.getAllFlights - failed with error: ' + err);
        return await next(err);
      }
      if (!flights) {
        logger.error('ERROR IN METHOD - server.api.flight.getAllFlights - no records found in db');
        return await res.status(401).send({ success: false, msg: 'No flights were found.' });
      } else {
        logger.info('METHOD EXIT - server.api.flight.getAllFlights - successfully fetched records from db');
        return await res.json(flights);
      }
    });
  } else {
    logger.error('ERROR IN METHOD - server.api.flight.getAllFlights - unauthorized to fetch records from db');
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* GET SINGLE FLIGHT BY ID */
async function getFlightDetail(req, res) {
  logger.info('METHOD ENTRY - server.api.flight.getAllAircrafts');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Flight.find({
      flight_no: req.params.flight_no
    }, async (err, flight) => {
      if (err) return await next(err);
      if (!flight) {
        return await res.status(403).send({ success: false, msg: 'Search failed. Flight not found.' });
      } else {
        return await res.json(flight);
      }
    });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* SAVE Flight */
async function createFlight(req, res) {
  logger.info('METHOD ENTRY - server.api.flight.getAllAircrafts');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    let newFlight = new Flight({
      flight_no: req.body.flight_no,
      origin: req.body.origin,
      destination: req.body.destination,
      departuredatetime: req.body.depart_time,
      arrivaldatetime: req.body.arrival_time,
      aircraft_id: req.body.aircraft_id,
      price: req.body.price,
      carrier: req.body.carrier,
      duration: req.body.duration,
      miles: req.body.miles,
      inventory_id: req.body.inventory_id,
      equipment_id: req.body.equipment_id
    });

    newFlight.save(async (err) => {
      if (err) {
        return await res.status(403).send({ success: false, msg: 'Save flight failed.' });
      }
      return await res.json({ success: true, msg: 'Successful created new flight.' });
    });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* SAVE Multiple Flights */
async function multiCreateFlight(req, res) {
  logger.info('METHOD ENTRY - server.api.flight.getAllAircrafts');
  let token = await getHeaderToken(req.headers);
  if (token) {
    let flightArray = new Array;
    for (let i = 0; i < 999; i++) {
      let newFlight = new Flight({
        flight_no: req.body.flight_no,
        origin: req.body.origin,
        destination: req.body.destination,
        departuredatetime: moment(req.body.depart_time).add(i, 'days'),
        arrivaldatetime: moment(req.body.arrival_time).add(i, 'days'),
        aircraft_id: req.body.aircraft_id,
        price: req.body.price,
        carrier: req.body.carrier,
        duration: req.body.duration,
        miles: req.body.miles,
        inventory_id: req.body.inventory_id,
        equipment_id: req.body.equipment_id
      });
      flightArray.push(newFlight);
    }

    flightArray.insertMany(async (err) => {
      if (err) {
        return await res.status(403).send({ success: false, msg: 'Save flight failed.' });
      }
      return await res.json({ success: true, msg: 'Successful created new flight.' });
    });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* UDPATE FLIGHT */
async function updateFlight(req, res) {
  logger.info('METHOD ENTRY - server.api.flight.getAllAircrafts');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Flight.findOneAndUpdate(
      req.params.flight_no, req.body
      , async (err, flight) => {
        if (err) return await next(err);
        return await res.json(flight);
      });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* DELETE FLIGHT */
async function deleteFlight(req, res) {
  logger.info('METHOD ENTRY - server.api.flight.getAllAircrafts');
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Flight.findOneAndRemove(
      req.params.flight_no, async (err) => {
        if (err) return await next(err);
        return await res.status(200).send({ success: true, msg: 'Sucessfully deleted !' });
      });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* GET Flight-search RESULTS data */
async function getFlightSearchResults(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  let aggregateQuery = await getAggregateQuery(req);
  console.log('aggregateQuery***', aggregateQuery);

  if (token) {
    Flight.find({
      origin: req.query.fromcity,
      destination: req.query.tocity,
      departureDate: { $gte: req.query.departDateTime + "T00:00:00.000Z", $lte: req.query.departDateTime + "T23:59:59.999Z" },
      // arrivalDate: { $gt: req.query.arrivalDatetime + "T00:00:00.000Z", $lt: req.query.arrivalDatetime + "T23:59:59.999Z" },
    })
      .sort({ departureDate: -1 })
      .select({ flight_no: 1,origin: 1, destination: 1, departureDate: 1, arrivalDate: 1, aircraft_no: 1, price: 1, duration: 1 })
      .exec(async (err, flights) => {
        if (err) {
          logger.info(err);
          return await next(err);
        };
        if (!flights) {
          return await res.status(401).send({ success: false, msg: 'Search failed. Flight not found.' });
        } else {
          return await res.json(flights);
        };
      });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
// async function getFlightSearchResults(req, res) {
//   let token = await utils.getHeaderToken(req.headers);
//   let aggregateQuery = await getAggregateQuery(req);
//   console.log('aggregateQuery***', aggregateQuery);

//   if (token) {
//     mongoose.model('Flight')
//       .aggregate(aggregateQuery)
//       .exec(async (err, flights) => {
//         if (err) {
//           logger.info(err);
//           return await next(err);
//         };
//         if (!flights) {
//           return await res.status(401).send({ success: false, msg: 'Search failed. Flight not found.' });
//         } else {
//           return await res.json(flights);
//         };
//       });
//   } else {
//     return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
//   }
// }

async function getAggregateQuery(req) {
  logger.info('METHOD ENTRY - server.api.flight.getAggregateQuery');
  /*   let obj1 = {
      $gte: req.query.departDateTime + 'T00:00:00.000Z',
      $lte: req.query.departDateTime + 'T23:59:59.999Z'
    };
    let obj2 = {
      $gte: req.query.arrivalDatetime + 'T00:00:00.000Z',
      $lte: req.query.arrivalDatetime + 'T23:59:59.999Z'
    };

    let myquery = (req.query.return === "true") ? ('{ "$or": [{ "origin": "' + req.query.fromcity + '", "destination": "' + req.query.tocity + '","departuredatetime": ' + JSON.stringify(obj1) + ' },'
    + '{ "origin": "' + req.query.tocity + '", "destination": "' + req.query.fromcity + '","departuredatetime": ' + JSON.stringify(obj2) + '}] } }')
    : ('"origin":' + req.query.fromcity + ',"destination":' + req.query.tocity + ',"departuredatetime":' + JSON.stringify(obj1)) ;
   */
  if (req === null) {
    return await null;
  } else {
    if (req.query.return === "true") {
      let returnQuery = [
        {
          "$match": {
            "$or": [{
              "origin": req.query.fromcity,
              "destination": req.query.tocity,
              "departuredatetime": { "$gte": req.query.departDateTime + "T00:00:00.000Z", "$lte": req.query.departDateTime + "T23:59:59.999Z" }
            },
            {
              "origin": req.query.tocity,
              "destination": req.query.fromcity,
              "departuredatetime": { "$gte": req.query.arrivalDatetime + "T00:00:00.000Z", "$lte": req.query.arrivalDatetime + "T23:59:59.999Z" }
            }]
          }
        },
        {
          "$lookup": {
            "from": "inventory",
            "localField": "inventory_id",
            "foreignField": "inventory_id",
            "as": "inventory"
          }
        },
        {
          "$replaceRoot": {
            "newRoot": {
              "$mergeObjects": [{
                "$arrayElemAt": ["$inventory", 0]
              }, "$$ROOT"]
            }
          }
        },
        {
          "$project": {
            "inventory": 0
          }
        }
      ];

      return await returnQuery
    } else {
      let onewayQuery = [{
        "$match": {
          "origin": req.query.fromcity,
          "destination": req.query.tocity,
          "departuredatetime": { "$gte": req.query.departDateTime + "T00:00:00.000Z", "$lte": req.query.departDateTime + "T23:59:59.999Z" }
        }
      },
      {
        "$lookup": {
          "from": "inventory",
          "localField": "inventory_id",
          "foreignField": "inventory_id",
          "as": "inventory"
        }
      },
      {
        "$replaceRoot": {
          "newRoot": {
            "$mergeObjects": [{
              "$arrayElemAt": ["$inventory", 0]
            }, "$$ROOT"]
          }
        }
      },
      {
        "$project": {
          "inventory": 0
        }
      }];

      return await onewayQuery;
    }
  }
}

module.exports = {
  getAllFlights: getAllFlights,
  getFlightDetail: getFlightDetail,
  createFlight: createFlight,
  multiCreateFlight: multiCreateFlight,
  updateFlight: updateFlight,
  deleteFlight: deleteFlight,
  getFlightSearchResults: getFlightSearchResults
}