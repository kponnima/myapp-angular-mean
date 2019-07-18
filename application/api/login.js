/*
 *  Controller which handles api requests coming from the router.
 *  Login API request controller
 */
'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const config = require('../../config/database');

/* LOGIN */
async function signin(req, res) {
  console.log('Im here ****');
  console.log('Im here ****', JSON.stringify(req.body));
  User.findOne({
    username: req.body.username
  }, async (err, user) => {
    if (err) throw err;
    if (!user) {
      await res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      await user.comparePassword(req.body.password, async (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          // return the information including token as JSON
          await res.json({ success: true, token: 'JWT ' + token });
          //res.json({success: true, token: 'JWT ' + token, profile: user.toJSON()});
        } else {
          await res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
}

module.exports = {
  signin: signin
}