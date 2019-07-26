let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let InventorySchema = new Schema({
  inventory_id: {
    type: Number,
    required: true
  },
  cabinTypes: {
    type: Array,
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
  legSeatsSold: {
    type: Number,
    required: true
  },
  coachSeatsSold: {
    type: Number,
    required: true
  },
  economySeatsSold: {
    type: Number,
    required: false
  },
  premiumEconomySeatsSold: {
    type: Number,
    required: false
  },
  businessSeatsSold: {
    type: Number,
    required: false
  },
  firstSeatsSold: {
    type: Number,
    required: false
  }
},
  {autoIndex: false},
  {collection: 'inventory'}
);

module.exports = mongoose.model('Inventory', InventorySchema);