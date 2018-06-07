var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = mongoose.model('User');
var Flight = require('../models/Flight');

/* REGISTER */
router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.json({success: false, msg: 'Please pass username and password.'});
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
      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Username already exists.'});
        }
        res.json({success: true, msg: 'Successful created new user.'});
      });
}});

/* LOGIN */
router.post('/signin', function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
});

/* SAVE Flight */
router.post('/flight-create', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    console.log(token);
    if (token) {
        console.log(req.body);
        var newFlight = new Flight({
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher
        });

        newFlight.save(function(err) {
        if (err) {
            return res.json({success: false, msg: 'Save flight failed.'});
        }
        res.json({success: true, msg: 'Successful created new flight.'});
        });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* GET DATA FOR Flight-search */
router.get('/flight-search', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  console.log(token);
  if (token) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // get the privilege_id
        var privilege_id = user.privilege_id;
        return res.json(privilege_id);
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

/* GET ALL Flights */
router.get('/flights', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    console.log(token);
    if (token) {
      Flight.find(function (err, flights) {
        if (err) return next(err);
        res.json(flights);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

/* GET SINGLE FLIGHT BY ID */
router.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  console.log(token);
  if (token) {
    Flight.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

/* UDPATE FLIGHT */
router.put('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Flight.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

/* DELETE FLIGHT */
router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Flight.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

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