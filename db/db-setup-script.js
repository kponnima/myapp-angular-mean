/* Clean up scripts */
// db.aircrafts.remove({});
// db.airports.remove({});
// db.flights.remove({});
// db.inventory.remove({});
// db.payments.remove({});
// db.reservations.remove({});
// db.travelers.remove({});
// db.users.remove({});
/* Update scripts */
//AIRCRAFT model
// db.aircrafts.insert([{
//   'aircraft_no': 1,
//   'aircraft_id': 'AA1000',
//   'aircraftname': 'Airbus 100',
//   'carrier': 'AA',
//   'inventory_id': 1,
//   'equipment_id': 1
// }, {
//   'aircraft_no': 2,
//   'aircraft_id': 'AA1001',
//   'aircraftname': 'Airbus 101',
//   'carrier': 'AA',
//   'inventory_id': 1,
//   'equipment_id': 1
// }]);
//AIRPORT model
// db.aircrafts.insert([{
//   'airportcode': 'PHX',
//   'airportname': 'PHOENIX SKYHABOR INTERNATIONAL AIRPORT',
//   'cityname': 'PHOENIX',
//   'countrycode': 'US',
//   'countryname': 'UNITED STATES OF AMERICA'
// }, {
//   'airportcode': 'DFW',
//   'airportname': 'DALLAS FORT WORTH INTERNATIONAL AIRPORT',
//   'cityname': 'DALLAS',
//   'countrycode': 'US',
//   'countryname': 'UNITED STATES OF AMERICA'
// }]);
module.exports = {
  aircraftRecords: [{
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
  }]

};