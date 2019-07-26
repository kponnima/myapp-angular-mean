/*
 *  Controller which handles api requests coming from the router.
 *  Payment API request controller
 */
'use strict';

const Reservation = require('../models/Reservation');
const utils = require('../lib/utils');

/* CREATE PNR - Flight booking */
async function createReservation(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    let newTravelers = new Traveler({
      username: req.body.createpnr["1"].username,
      pnrno: req.body.createpnr["0"].pnrno,
      traveler_id: req.body.createpnr["1"].traveler_id,
      travelerfirstname: req.body.createpnr["1"].travelerfirstname,
      travelermiddlename: req.body.createpnr["1"].travelermiddlename,
      travelerlastname: req.body.createpnr["1"].travelerlastname,
      traveleraddress: req.body.createpnr["1"].traveleraddress,
      travelerzipcode: req.body.createpnr["1"].travelerzipcode,
      traveleremail: req.body.createpnr["1"].traveleremail,
      travelerphone: req.body.createpnr["1"].travelerphone,
      travelerseatpreference: req.body.createpnr["1"].travelerseatpreference,
      travelerspecialservices: req.body.createpnr["1"].travelerspecialservices,
      travelermealpreference: req.body.createpnr["1"].travelermealpreference,
      needpassport: req.body.createpnr["1"].needpassport,
      passportno: req.body.createpnr["1"].passportno,
      passportissue: req.body.createpnr["1"].passportissue,
      passportexpiry: req.body.createpnr["1"].passportexpiry,
      passportissuingcountry: req.body.createpnr["1"].passportissuingcountry,
      passportcountryofcitizenship: req.body.createpnr["1"].passportcountryofcitizenship,
      passportcountryofresidence: req.body.createpnr["1"].passportcountryofresidence,
      emergencycontactfirstname: req.body.createpnr["1"].emergencycontactfirstname,
      emergencycontactmiddlename: req.body.createpnr["1"].emergencycontactmiddlename,
      emergencycontactlastname: req.body.createpnr["1"].emergencycontactlastname,
      emergencycontactaddress: req.body.createpnr["1"].emergencycontactaddress,
      emergencycontactzipcode: req.body.createpnr["1"].emergencycontactzipcode,
      emergencycontactemail: req.body.createpnr["1"].emergencycontactemail,
      emergencycontactphone: req.body.createpnr["1"].emergencycontactphone
    });
    let newReservation = new Reservation({
      pnrno: req.body.createpnr["0"].pnrno,
      total_amount: req.body.createpnr["0"].total_amount,
      card_token: req.body.createpnr["0"].card_token,
      paymentstatus: req.body.createpnr["0"].paymentstatus,
      segment_count: req.body.createpnr["0"].segment_count,
      segment_id: req.body.createpnr["0"].segment_id,
      flight_no: req.body.createpnr["0"].flight_no,
      origin: req.body.createpnr["0"].origin,
      destination: req.body.createpnr["0"].destination,
      departuredatetime: req.body.createpnr["0"].departuredatetime,
      arrivaldatetime: req.body.createpnr["0"].arrivaldatetime,
      price: req.body.createpnr["0"].price,
      cabintype: req.body.createpnr["0"].cabintype,
      seatno: req.body.createpnr["0"].seatno,
      passenger_count: req.body.createpnr["1"].passenger_count,
      traveler_id: req.body.createpnr["1"].traveler_id
    });

    //SAVE the Traveler first and THEN create the reservation
    newTravelers.save(async (err, traveler) => {
      if (err) return await next(err);
      if (!traveler) {
        return await res.status(401).send({success: false, msg: 'Failed to save travelers !'});
      } else {
        newReservation.save(async (err, reservation) => {
          if (err) return await next(err);
          if (!reservation) {
            return await res.json({success: false, msg: 'Create PNR failed.'});
          }
          return await res.json({success: true, msg: 'Successful created new flight reservation.', pnr: reservation.pnrno});
        });
      }
    });
  }
  else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

/* GET FLIGHT-TRIP-CONFIRMATION data */
async function getReservation(req, res) {
  let token = await utils.getHeaderToken(req.headers);
  if (token) {
    Reservation.findOne({
      pnrno: req.params.pnr
    }, async (err, reservation) => {
      if (err) return await next(err);
      if (!reservation) {
        return await res.status(401).send({success: false, msg: 'No reservations were found.'});
      } else {
        return await res.json(reservation);
      }
    });
  } else {
    return await res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

module.exports = {
  getReservation: getReservation,
  createReservation: createReservation
}