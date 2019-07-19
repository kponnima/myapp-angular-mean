let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let AircraftSchema = new Schema({
  aircraft_no: {
    type: Number,
    required: true,
    unique: true
  },
  aircraft_id: {
    type: String,
    required: true
  },
  aircraftname: {
    type: String,
    required: false
  },
  carrier: {
    type: String,
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
  {autoIndex: false},
  {collection: 'aircrafts'}
);

// AircraftSchema.plugin(autoIncrement.plugin, 'Aircraft');
module.exports = mongoose.model('Aircraft', AircraftSchema);