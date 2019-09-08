let passport = require('passport');
require('../middleware/passport')(passport);

const express = require('express');
const router = express.Router();
const logMiddleware = require('../middleware/log');

const api = {
  aircraft: require('../api/aircraft'),
  airport: require('../api/airport'),
  flight: require('../api/flight'),
  inventory: require('../api/inventory'),
  login: require('../api/login'),
  payment: require('../api/payment'),
  register: require('../api/register'),
  reservation: require('../api/reservation'),
  traveler: require('../api/traveler'),
  user: require('../api/user'),
}

/* LOGIN & REGISTER Routes */
router.route('/signin').post(logMiddleware, api.login.signin);
router.route('/signup').post(logMiddleware, api.register.signup);
/* USER Routes */
router.route('/user/:username').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.user.getUser);
router.route('/users').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.user.getAllUsers);
router.route('/user-detail/:username').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.user.getUserDetail);
router.route('/user-create').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.user.createUser);
router.route('/user-edit/:username').put(logMiddleware, passport.authenticate('jwt', { session: false }), api.user.updateUser);
router.route('/user/:username').delete(logMiddleware, passport.authenticate('jwt', { session: false }), api.user.deleteUser);
/* FLIGHT Routes */
// router.route('/flight/:flight_no').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.getFlight);
router.route('/flights').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.getAllFlights);
router.route('/flight-detail/:flight_no').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.getFlightDetail);
// router.route('/flight-search').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.getFlightSearchResults);
router.route('/flight-search-results').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.getFlightSearchResults);
// router.route('/flight-trip-options').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.getFlightSearchResults);
router.route('/flight-create').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.createFlight);
router.route('/flight-bulk-create').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.multiCreateFlight);
router.route('/flight-edit/:flight_no').put(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.updateFlight);
router.route('/flight/:flight_no').delete(logMiddleware, passport.authenticate('jwt', { session: false }), api.flight.deleteFlight);
/* AIRPORT Routes */
// router.route('/airport/:flight_no').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.airport.getAirport);
router.route('/airports').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.airport.getAllAirports);
router.route('/airport-detail/:airportcode').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.airport.getAirportDetail);
router.route('/airport-create').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.airport.createAirport);
router.route('/airport-edit/:airportcode').put(logMiddleware, passport.authenticate('jwt', { session: false }), api.airport.updateAirport);
router.route('/airport/:airportcode').delete(logMiddleware, passport.authenticate('jwt', { session: false }), api.airport.deleteAirport);
/* AIRCRAFT Routes */
// router.route('/aircraft/:aircraft_no').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.aircraft.getAircraft);
router.route('/aircrafts').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.aircraft.getAllAircrafts);
router.route('/aircraft-detail/:aircraft_no').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.aircraft.getAircraftDetail);
router.route('/aircraft-create').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.aircraft.createAircraft);
router.route('/aircraft-edit/:aircraft_no').put(logMiddleware, passport.authenticate('jwt', { session: false }), api.aircraft.updateAircraft);
router.route('/aircraft/:aircraft_no').delete(logMiddleware, passport.authenticate('jwt', { session: false }), api.aircraft.deleteAircraft);
/* INVENTORY Routes */
/* PAYMENT Routes */
router.route('/paymentcards').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.payment.getAllPayments);
router.route('/paymentcard/:token').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.payment.getPaymentByToken);
router.route('/charge').post(logMiddleware, api.payment.savePayment);
router.route('/paymentcard').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.payment.savePayment);
/* RESERVATION Routes */
router.route('/flight-reservation/:pnr').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.reservation.getReservation);
// router.route('/flight-reservations').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.reservation.getAllReservations);
// router.route('/flight-reservation-detail/:pnr').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.reservation.getReservationDetail);
router.route('/flight-reservation-create').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.reservation.createReservation);
// router.route('/flight-reservation-edit/:pnr').put(logMiddleware, passport.authenticate('jwt', { session: false }), api.reservation.updateReservation);
// router.route('/flight-reservation/:pnr').delete(logMiddleware, passport.authenticate('jwt', { session: false }), api.reservation.deleteReservation);
/* TRAVELER Routes */
router.route('/flight-traveler/:traveler_id').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.traveler.getTraveler);
// router.route('/flight-travelers').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.traveler.getAllTravelers);
// router.route('/flight-traveler-details/:traveler_id').get(logMiddleware, passport.authenticate('jwt', { session: false }), api.traveler.getTravelerDetail);
// router.route('/flight-traveler-create').post(logMiddleware, passport.authenticate('jwt', { session: false }), api.traveler.createTraveler);
// router.route('/flight-traveler-edit/:traveler_id').put(logMiddleware, passport.authenticate('jwt', { session: false }), api.traveler.updateTraveler);
// router.route('/flight-traveler/:traveler_id').delete(logMiddleware, passport.authenticate('jwt', { session: false }), api.traveler.deleteTraveler);

module.exports = router;