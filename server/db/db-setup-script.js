/* Update scripts */
let utils = require('../lib/utils'),
  moment = require('moment');

module.exports = {
  createIndex: {
    'aircrafts': 'aircraft_no',
    'airports': 'airportcode',
    'flights': 'flight_no',
    'inventory': 'inventory_id',
    'users': 'username'
  },
  aircrafts: [{
    'aircraft_no': 1,
    'aircraft_id': 'AA1000',
    'aircraftname': 'Airbus 100',
    'carrier': 'AA',
    'inventory_id': 1,
    'equipment_id': 1
  }, {
    'aircraft_no': 2,
    'aircraft_id': 'AA1001',
    'aircraftname': 'Airbus 101',
    'carrier': 'AA',
    'inventory_id': 1,
    'equipment_id': 1
  }],
  airports: [{
    'airportcode': 'PHX',
    'airportname': 'PHOENIX SKYHABOR INTERNATIONAL AIRPORT',
    'cityname': 'PHOENIX',
    'countrycode': 'US',
    'countryname': 'UNITED STATES OF AMERICA'
  }, {
    'airportcode': 'DFW',
    'airportname': 'DALLAS FORT WORTH INTERNATIONAL AIRPORT',
    'cityname': 'DALLAS',
    'countrycode': 'US',
    'countryname': 'UNITED STATES OF AMERICA'
  }],
  flights: [{
    'flight_no': 1,
    'origin': 'PHX',
    'destination': 'DFW',
    'departureDate': moment(new Date()).toISOString(),
    'departureTime': '06:00',
    'arrivalDate': moment(new Date()).toISOString(),
    'arrivalTime': '08:00',
    'aircraft_no': 1,
    'price': 240,
    'duration': 840000,
    'distance': 868,
    'cancelStatus': false,
    'departureGate': 'A01',
    'arrivalGate': 'B01',
    'mealService': ['VEG', 'NONVEG', 'VEGAN'],
    'webCheckinTime': '2019-07-18T06:00'
  }, {
    'flight_no': 2,
    'origin': 'PHX',
    'destination': 'LAX',
    'departureDate': moment(new Date()).toISOString(),
    'departureTime': '06:00',
    'arrivalDate': moment(new Date()).toISOString(),
    'arrivalTime': '08:00',
    'aircraft_no': 2,
    'price': 180,
    'duration': 840000,
    'distance': 868,
    'cancelStatus': false,
    'departureGate': 'A01',
    'arrivalGate': 'B01',
    'mealService': ['VEG', 'NONVEG', 'VEGAN'],
    'webCheckinTime': '2019-07-18T06:00'
  }, {
    'flight_no': 3,
    'origin': 'PHX',
    'destination': 'SFO',
    'departureDate': moment(new Date()).toISOString(),
    'departureTime': '06:00',
    'arrivalDate': moment(new Date()).toISOString(),
    'arrivalTime': '08:00',
    'aircraft_no': 1,
    'price': 280,
    'duration': 840000,
    'distance': 868,
    'cancelStatus': false,
    'departureGate': 'A01',
    'arrivalGate': 'B01',
    'mealService': ['VEG', 'NONVEG', 'VEGAN'],
    'webCheckinTime': '2019-07-18T06:00'
  }],
  inventory: [{
    'inventory_id': 1,
    'cabinTypes': ['COACH', 'ECONOMY', 'PREMIUMECONOMY', 'BUSINESS', 'FIRST'],
    'aircraftCapacity': 500,
    'authorizationLevel': 480,
    'legSeatsAvailable': 10,
    'legSeatsSold': 2,
    'coachSeatsSold': 100,
    'economySeatsSold': 0,
    'premiumEconomySeatsSold': 0,
    'businessSeatsSold': 0,
    'firstSeatsSold': 0
  }, {
    'inventory_id': 2,
    'cabinTypes': ['COACH', 'ECONOMY', 'PREMIUMECONOMY', 'BUSINESS'],
    'aircraftCapacity': 500,
    'authorizationLevel': 480,
    'legSeatsAvailable': 10,
    'legSeatsSold': 2,
    'coachSeatsSold': 100,
    'economySeatsSold': 0,
    'premiumEconomySeatsSold': 0,
    'businessSeatsSold': 0,
    'firstSeatsSold': 0
  }, {
    'inventory_id': 3,
    'cabinTypes': ['COACH', 'PREMIUMECONOMY'],
    'aircraftCapacity': 500,
    'authorizationLevel': 480,
    'legSeatsAvailable': 10,
    'legSeatsSold': 2,
    'coachSeatsSold': 100,
    'economySeatsSold': 0,
    'premiumEconomySeatsSold': 0,
    'businessSeatsSold': 0,
    'firstSeatsSold': 0
  }, {
    'inventory_id': 4,
    'cabinTypes': ['COACH', 'PREMIUMECONOMY'],
    'aircraftCapacity': 500,
    'authorizationLevel': 480,
    'legSeatsAvailable': 10,
    'legSeatsSold': 2,
    'coachSeatsSold': 100,
    'economySeatsSold': 0,
    'premiumEconomySeatsSold': 0,
    'businessSeatsSold': 0,
    'firstSeatsSold': 0
  }],
  payments: [{
  }, {

  }],
  reservations: [{
  }, {

  }],
  travelers: [{
  }, {

  }],
  users: [{
    'username': 'testuser1',
    'password': utils.getPasswordHashSync('Password1'),
    'email': 'testemail@gmail.com',
    'phone': 1111111111,
    'date_created': new Date(),
    'role_id': 1,
    'privilege_id': 1,
    'status_id': 1
  }, {
    'username': 'testuser2',
    'password': utils.getPasswordHashSync('Password2'),
    'email': 'testemail@gmail.com',
    'phone': 1111111111,
    'date_created': new Date(),
    'role_id': 2,
    'privilege_id': 1,
    'status_id': 1
  }, {
    'username': 'testuser3',
    'password': utils.getPasswordHashSync('Password3'),
    'email': 'testemail@gmail.com',
    'phone': 1111111111,
    'date_created': new Date(),
    'role_id': 2,
    'privilege_id': 2,
    'status_id': 1
  }, {
    'username': 'testuser4',
    'password': utils.getPasswordHashSync('Password4'),
    'email': 'testemail@gmail.com',
    'phone': 1111111111,
    'date_created': new Date(),
    'role_id': 2,
    'privilege_id': 1,
    'status_id': 2
  }]
};