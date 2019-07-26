/*
 *  Controller which handles api requests coming from the router.
 *  Traveler API request controller
 */
'use strict';
const Traveler = require('../models/Traveler');

/* GET TRAVELER data */
async function getTraveler(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Traveler.find({
      traveler_id: req.params.traveler_id
    }, async (err, travelers) => {
      if (err) return await next(err);
      if (!travelers) {
        return await res.status(401).send({ success: false, msg: 'No travelers were found.' });
      } else {
        return await res.json(travelers);
      }
    });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}

module.exports = {
  getTraveler: getTraveler
}