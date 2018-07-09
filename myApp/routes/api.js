const keyPublishable = process.env.PUBLISHABLE_KEY;
//const keySecret = process.env.SECRET_KEY;
const keySecret = 'sk_test_qBQ7uEhbyUahpxrNTf5c8ugz';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var stripe = require('stripe')(keySecret);

var User = mongoose.model('User');
var Flight = require('../models/Flight');
var Airport = require('../models/Airport');
var Aircraft = require('../models/Aircraft');
var Inventory = require('../models/Inventory');
var Traveler = require('../models/Traveler');
var Payment = require('../models/Payment');
var Reservation = require('../models/Reservation');

/* REGISTER */
router.post('/signup', function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: 'Please pass username and password.' });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      date_created: req.body.date_created,
      role_id: req.body.role_id,
      privilege_id: req.body.privilege_id,
      status_id: req.body.status_id
    });
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.status(403).send({ success: false, msg: 'Username already exists.' });
      }
      res.json({ success: true, msg: 'Successful created new user.' });
    });
  }
});

/* LOGIN */
router.post('/signin', function (req, res) {
  User.findOne({
    username: req.body.username
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          res.json({ success: true, token: 'JWT ' + token });
          //res.json({success: true, token: 'JWT ' + token, profile: user.toJSON()});
        } else {
          res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
});

/* GET DATA for HOME */
router.get('/user/:username', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    User.find(
      { username: req.params.username },
      { password: 0 },
      function (err, user) {
        if (err) return next(err);
        if (!user) {
          res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
          return res.json(user);
        }
      });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET data for ADMIN */
router.get('/admin', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    return res.sendStatus(200);
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET USERS for ADMIN*/
router.get('/users', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    User.find({
    }, function (err, airports) {
      if (err) return next(err);
      if (!airports) {
        res.status(401).send({ success: false, msg: 'Authentication failed!' });
      } else {
        // get the list of airports
        return res.json(airports);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* SAVE USER */
router.post('/user-create', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      phone: req.body.phone,
      date_created: req.body.date_created,
      role_id: req.body.role_id,
      privilege_id: req.body.privilege_id,
      status_id: req.body.status_id
    });
    
    newUser.save(function (err) {
      if (err) {
        return res.status(403).send({ success: false, msg: 'Save airport failed.' });
      }
      res.json({ success: true, msg: 'Successful created new airport.' });
    });
  } else {
    return res.status(401).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET ALL FLIGHTS data */
router.get('/flights', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Flight.find({
    }, function (err, flights) {
      if (err) return next(err);
      if (!flights) {
        res.status(401).send({ success: false, msg: 'No flights were found.' });
      } else {
        return res.json(flights);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* SAVE Flight */
router.post('/flight-create', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
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

    newFlight.save(function (err) {
      if (err) {
        return res.status(403).send({ success: false, msg: 'Save flight failed.' });
      }
      res.json({ success: true, msg: 'Successful created new flight.' });
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET SINGLE FLIGHT BY ID */
router.get('/flight-detail/:flight_no', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Flight.find(
      { flight_no: req.params.flight_no }
    , function (err, flight) {
        if (err) return next(err);
        if (!flight) {
          res.status(403).send({ success: false, msg: 'Search failed. Flight not found.' });
        } else {
          return res.json(flight);
        }
      });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* UDPATE FLIGHT */
router.put('/flight-edit/:flight_no', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Flight.findOneAndUpdate(
      req.params.flight_no, req.body
    , function (err, flight) {
      if (err) return next(err);
      res.json(flight);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* DELETE FLIGHT */
router.delete('/flight/:flight_no', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  console.log(req.params.flight_no);
  if (token) {
    Flight.findOneAndRemove(
      req.params.flight_no, function (err, flight) {
      if (err) return next(err);
      res.json(flight);
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET AIRPORTS for ADMIN && HOME */
router.get('/airports', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Airport.find({
    }, function (err, airports) {
      if (err) return next(err);
      if (!airports) {
        res.status(401).send({ success: false, msg: 'Authentication failed!' });
      } else {
        // get the list of airports
        return res.json(airports);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* SAVE AIRPORT */
router.post('/airport-create', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var newAirport = new Airport({
      airportcode: req.body.airportcode,
      origin: req.body.airportname,
      cityname: req.body.cityname,
      countrycode: req.body.countrycode,
      countryname: req.body.countryname
    });
    
    newAirport.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Save airport failed.' });
      }
      res.json({ success: true, msg: 'Successful created new airport.' });
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET AIRCRAFTS for ADMIN*/
router.get('/aircrafts', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Aircraft.find({
    }, function (err, aircrafts) {
      if (err) return next(err);
      if (!aircrafts) {
        res.status(401).send({ success: false, msg: 'Authentication failed!' });
      } else {
        // get the list of aircrafts
        return res.json(aircrafts);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* SAVE AIRCRAFT */
router.post('/aircraft-create', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var newAircraft = new Aircraft({
      aircraft_id: req.body.aircraft_id,
      aircraft_name: req.body.aircraft_name,
      carrier: req.body.carrier,
      inventory_id: req.body.inventory_id,
      equipment_Id: req.body.equipment_Id
    });
    
    newAircraft.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Save aircraft failed.' });
      }
      res.json({ success: true, msg: 'Successful created new aircraft.' });
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});


/* GET DATA FOR Flight-search */
router.get('/flight-search', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    User.findOne({
      username: req.body.username
    }, function (err, user) {
      if (err) return next(err);
      if (!user) {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
      } else {
        // get the privilege_id
        var privilege_id = user.privilege_id;
        return res.json(privilege_id);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET Flight-search RESULTS data */
router.get('/flight-search-results', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    mongoose.model('Flight')
      .aggregate([
        {
          "$match": {
            "origin": req.query.fromcity,
            "destination": req.query.tocity
          },
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
          "$project": { "inventory": 0 }
        }
      ])
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

/* GET ALL FLIGHT-TRIP-OPTIONS data */
router.get('/flight-trip-options', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    return res.sendStatus(200);
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* POST PAYMENT */
router.post('/charge', function (req, res) {
  //console.log(keySecret);
  stripe.customers.create({
    email: req.headers.email,
    card: req.headers.token,
  })
    .then(customer =>
      stripe.charges.create({
        amount: req.headers.amount,
        description: "Flight booking charge",
        currency: "usd",
        customer: customer.id,
        source: req.body.token,
        statement_descriptor: 'Flight booking charge',
        metadata: { order_id: req.headers.orderid }
      }))
    .then(charge => res.send({
      token: req.headers.token,
      card_id: charge.source.id,
      order_id: charge.metadata.order_id,
      customer_id: charge.customer,
      last4: charge.source.last4,
      brand: charge.source.brand,
      description: charge.description,
      paid_status: charge.paid,
      currency: charge.currency,
      amount: charge.amount,
      statement_description: charge.statement_descriptor,
      status: charge.status
    }
    ))
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({ error: "Purchase Failed" });
    });
});

/* SAVE Payment Card */
router.post('/paymentcard', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var newPayment = new Payments({
      token: req.body.token,
      card_id: req.body.card_id,
      order_id: req.body.order_id,
      customer_id: req.body.customer_id,
      last4: req.body.last4,
      brand: req.body.brand,
      description: req.body.description,
      paid_status: req.body.paid_status,
      currency: req.body.currency,
      amount: req.body.amount,
      statement_description: req.body.statement_descriptor,
      status: req.body.status
    });
    newPayment.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: 'Save payment cards failed.' });
      }
      res.json({ success: true, msg: 'Successful saved payment card info.' });
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* CREATE PNR - Flight booking */
router.post('/flight-createreservation', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var newTravelers = new Travelers({
      username: req.body.username,
      pnrno: req.body.pnrno,
      traveler_id: req.body.traveler_id,
      travelerfirstname: req.body.travelerfirstname,
      travelermiddlename: req.body.travelermiddlename,
      travelerlastname: req.body.travelerlastname,
      traveleraddress: req.body.traveleraddress,
      travelerzipcode: req.body.travelerzipcode,
      traveleremail: req.body.traveleremail,
      travelerphone: req.body.travelerphone,
      travelerseatpreference: req.body.travelerseatpreference,
      travelerspecialservices: req.body.travelerspecialservices,
      travelermealpreference: req.body.travelermealpreference,
      needpassport: req.body.needpassport,
      passportno: req.body.passportno,
      passportexpiry: req.body.passportexpiry,
      passportissuingcountry: req.body.passportissuingcountry,
      passportcountryofcitizenship: req.body.passportcountryofcitizenship,
      passportcountryofresidence: req.body.passportcountryofresidence,
      emergencycontactfirstname: req.body.emergencycontactfirstname,
      emergencycontactmiddlename: req.body.emergencycontactmiddlename,
      emergencycontactlastname: req.body.emergencycontactlastname,
      emergencycontactaddress: req.body.emergencycontactaddress,
      emergencycontactzipcode: req.body.emergencycontactzipcode,
      emergencycontactemail: req.body.emergencycontactemail,
      emergencycontactphone: req.body.emergencycontactphone
    });
    var newReservation = new Reservations({
      pnrno: req.body.pnrno,
      total_amount: req.body.total_amount,
      card_token: req.body.card_token,
      paymentstatus: req.body.paymentstatus,
      segment_count: req.body.segment_count,
      segment_id: req.body.segment_id,
      flight_no: req.body.flight_no,
      origin: req.body.origin,
      destination: req.body.destination,
      departuredatetime: req.body.departuredatetime,
      arrivaldatetime: req.body.arrivaldatetime,
      price: req.body.price,
      cabintype: req.body.cabintype,
      seatno: req.body.seatno,
      passenger_count: req.body.passenger_count,
      traveler_id: req.body.traveler_id
    });

    //SAVE the Traveler first and THEN create the reservation
    newTravelers.save(function (err, traveler) {
      if (err) return next(err);
      if (!traveler) {
        res.status(401).send({ success: false, msg: 'Failed to save travelers !' });
      } else {
        newReservation.save(function (err, reservation) {
          if (err) return next(err);
          if (!reservation) {
            return res.json({ success: false, msg: 'Create PNR failed.' });
          }
          res.json({ success: true, msg: 'Successful created new flight reservation.', pnr: reservation.pnrno });
        });
      }
    });
  }
  else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET ALL FLIGHT-TRIP-CONFIRMATION data */
router.get('/reservation/:pnr', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Reservations.findOne({
      pnrno: req.params.pnr
    }, function (err, reservation) {
      if (err) return next(err);
      if (!reservation) {
        res.status(401).send({ success: false, msg: 'No reservations were found.' });
      } else {
        return res.json(reservation);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});

/* GET ALL PAYMENTCARDS data */
router.get('/paymentcard', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Payments.find({
      token: req.params.username
    }, function (err, flights) {
      if (err) return next(err);
      if (!flights) {
        res.status(401).send({ success: false, msg: 'No flights were found.' });
      } else {
        return res.json(flights);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});


//**********************************************MISC NOT USED********************************************************************************************************** */

router.get('/activeuser/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    User.findById(req.params._id, function (err, user) {
      if (err) return next(err);
      if (!user) {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
      } else {
        return res.json(user);
      }
    });
  } else {
    return res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
});


//**********************************************COMMON FUNCTIONS********************************************************************************************************** */
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;