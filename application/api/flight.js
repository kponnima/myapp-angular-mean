/*
 *  Controller which handles api requests coming from the router.
 *  Flight API request controller
 */
'use strict';
const Flight = require('../models/Flight');
const utils = require('../lib/utils');

/* GET ALL FLIGHTS data */
async function getAllFlights(req, res) {
  var token = utils.getToken(req.headers);
  if (token) {
    Flight.find({
    }, async (err, flights) => {
      if (err) return await next(err);
      if (!flights) {
        await res.status(401).send({success: false, msg: 'No flights were found.'});
      } else {
        return await res.json(flights);
      }
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* GET SINGLE FLIGHT BY ID */
async function getFlightDetail(req, res) {
  var token = utils.getToken(req.headers);
  if (token) {
    Flight.find(
      {flight_no: req.params.flight_no}
      , async (err, flight) => {
        if (err) return await next(err);
        if (!flight) {
          await res.status(403).send({success: false, msg: 'Search failed. Flight not found.'});
        } else {
          return await res.json(flight);
        }
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* SAVE Flight */
async function createFlight(req, res) {
  var token = utils.getToken(req.headers);
  if (token) {
    var newFlight = new Flight({
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
        return await res.status(403).send({success: false, msg: 'Save flight failed.'});
      }
      await res.json({success: true, msg: 'Successful created new flight.'});
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* SAVE Multiple Flights */
async function multiCreateFlight(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var flightArray = new Array;
    for (var i = 0; i < 999; i++) {
      var newFlight = new Flight({
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
        return await res.status(403).send({success: false, msg: 'Save flight failed.'});
      }
      await res.json({success: true, msg: 'Successful created new flight.'});
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* UDPATE FLIGHT */
async function updateFlight(req, res) {
  var token = utils.getToken(req.headers);
  if (token) {
    Flight.findOneAndUpdate(
      req.params.flight_no, req.body
      , async (err, flight) => {
        if (err) return await next(err);
        await res.json(flight);
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* DELETE FLIGHT */
async function deleteFlight(req, res) {
  var token = utils.getToken(req.headers);
  if (token) {
    Flight.findOneAndRemove(
      req.params.flight_no, async (err) => {
        if (err) return await next(err);
        await res.status(200).send({success: true, msg: 'Sucessfully deleted !'});
      });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
/* GET Flight-search RESULTS data */
router.get('/flight-search-results', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  var aggregateQuery = getAggregateQuery(req);

  console.log(aggregateQuery);

  if (token) {
    mongoose.model('Flight')
      .aggregate(aggregateQuery)
      .exec(function (err, flights) {
        if (err) {
          console.log(err);
          return next(err);
        };
        if (!flights) {
          res.status(401).send({ success: false, msg: 'Search failed. Flight not found.' });
        } else {
          return res.json(flights);
        };
      });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

async function getAggregateQuery(req) {
/*   var obj1 = {
    $gte: req.query.departDateTime + 'T00:00:00.000Z',
    $lte: req.query.departDateTime + 'T23:59:59.999Z'
  };
  var obj2 = {
    $gte: req.query.arrivalDatetime + 'T00:00:00.000Z',
    $lte: req.query.arrivalDatetime + 'T23:59:59.999Z'
  };

  var myquery = (req.query.return === "true") ? ('{ "$or": [{ "origin": "' + req.query.fromcity + '", "destination": "' + req.query.tocity + '","departuredatetime": ' + JSON.stringify(obj1) + ' },'
  + '{ "origin": "' + req.query.tocity + '", "destination": "' + req.query.fromcity + '","departuredatetime": ' + JSON.stringify(obj2) + '}] } }')
  : ('"origin":' + req.query.fromcity + ',"destination":' + req.query.tocity + ',"departuredatetime":' + JSON.stringify(obj1)) ;
 */
  if(req === null) {
    return await null;
  }else{
    if(req.query.return === "true"){
      var returnQuery = [
        {
          "$match": { "$or": [{ "origin": req.query.fromcity,
                              "destination": req.query.tocity,
                              "departuredatetime": { "$gte": req.query.departDateTime + "T00:00:00.000Z", "$lte": req.query.departDateTime + "T23:59:59.999Z" }
                            },
                            { "origin": req.query.tocity,
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
      var onewayQuery = [{
                      "$match": { "origin": req.query.fromcity,
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
  getFlight: getFlight,
  getAllFlights: getAllFlights,
  getFlightDetail: getFlightDetail,
  createFlight: createFlight,
  multiCreateFlight: multiCreateFlight,
  updateFlight: updateFlight,
  deleteFlight: deleteFlight
}