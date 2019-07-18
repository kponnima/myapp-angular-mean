var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var FlightSchema = new Schema({
  flight_no: {
    type: Number,
    unique: true,
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
    type: String,
    required: false
  },
  price: {
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
  equipment_id: {
    type: Number,
    required: true
  }
},
 { collection: 'flights' });

FlightSchema.plugin(autoIncrement.plugin, 'Flight');
module.exports = mongoose.model('Flight', FlightSchema);