var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlightsSchema = new Schema({
  flight_no: {
    type: Number,
    required: false
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departuredatetime: {
    type: String,
    required: false
  },
  arrivaldatetime: {
    type: String,
    required: false
  },
  aircraft_id: {
    type: Number,
    required: false
  },
  carrier: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    required: true
  },
  miles: {
    type: Number,
    required: true
  },
  inventory_id: {
    type: Number,
    required: true
  },
  equipment_Id: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Flights', FlightsSchema);