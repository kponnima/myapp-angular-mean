let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// let autoIncrement = require('mongoose-auto-increment');

let FlightSchema = new Schema({
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
  departureDate: {
    type: String,
    required: false
  },
  departureTime: {
    type: String,
    required: false
  },
  arrivalDate: {
    type: String,
    required: false
  },
  arrivalTime: {
    type: String,
    required: false
  },
  aircraft_no: {
    type: Number,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  duration: {
    type: Number,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  cancelStatus: {
    type: Boolean,
    required: true
  },
  departureGate: {
    type: String,
    required: false
  },
  arrivalGate: {
    type: String,
    required: false
  },
  inventory_no: {
    type: Number,
    required: true
  },
  mealService: {
    type: Array,
    required: true
  },
  webCheckinTime: {
    type: String,
    required: true
  }
},
  { autoIndex: false },
  { collection: 'flights' }
);

// FlightSchema.plugin(autoIncrement.plugin, 'Flight');
module.exports = mongoose.model('Flight', FlightSchema);