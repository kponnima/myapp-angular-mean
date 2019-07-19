let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');

let AirportSchema = new Schema({
  airportcode: {
    type: String,
    unique: true,
    required: true
  },
  airportname: {
    type: String,
    required: true
  },
  cityname: {
    type: String,
    required: false
  },
  countrycode: {
    type: String,
    required: true
  },
  countryname: {
    type: String,
    required: false
  }
},
  {autoIndex: false},
  {collection: 'airports'}
);

// AirportSchema.plugin(autoIncrement.plugin, {
//   model: 'Airport',
//   startAt: 1
// });
module.exports = mongoose.model('Airport', AirportSchema);