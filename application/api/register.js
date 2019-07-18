/*
 *  Controller which handles api requests coming from the router.
 *  Register API request controller
 */
'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');

/* REGISTER */
async function signup(req, res) {
  if (!req.body.username || !req.body.password) {
    return await res.json({ success: false, msg: 'Please pass username and password.' });
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
    newUser.save(async (err) => {
      if (err) {
        return await res.status(403).send({ success: false, msg: 'Username already exists.' });
      }
      return await res.json({ success: true, msg: 'Successful created new user.' });
    });
  }
}

module.exports = {
  signup: signup
}