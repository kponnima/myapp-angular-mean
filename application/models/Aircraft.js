var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var AircraftSchema = new Schema({
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
 { collection: 'aircrafts' });

AircraftSchema.plugin(autoIncrement.plugin, 'Aircraft');
module.exports = mongoose.model('Aircraft', AircraftSchema);