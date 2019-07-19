let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let InventorySchema = new Schema({
  inventory_id: {
    type: Number,
    required: true
  },
  cabinType: {
    type: String,
    required: true
  },
  aircraftCapacity: {
    type: Number,
    required: true
  },
  authorizationLevel: {
    type: Number,
    required: true
  },
  legSeatsAvailable: {
    type: Number,
    required: true
  },
  baseSeatsSold: {
    type: Number,
    required: true
  },
  eCount: {
    type: Number,
    required: true
  },
  cancelFlight: {
    type: String,
    required: true
  }
},
  {autoIndex: false},
  {collection: 'inventory'}
);

module.exports = mongoose.model('Inventory', InventorySchema);