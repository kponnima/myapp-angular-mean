/*
 *  Controller which handles api requests coming from the router.
 *  Login API request controller
 */
'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const config = require('config');

/* LOGIN */
async function signin(req, res) {
  User.findOne({
    username: req.body.username
  }, async (err, user) => {
    if (err) return await next(err);
    if (!user) {
      return await res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      return await user.comparePassword(req.body.password, async (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          let token = jwt.sign(user.toJSON(), config.get('secret'));
          // return the information including token as JSON
          return await res.json({ success: true, token: 'JWT ' + token });
          //res.json({success: true, token: 'JWT ' + token, profile: user.toJSON()});
        } else {
          return await res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  });
}

module.exports = {
  signin: signin
}