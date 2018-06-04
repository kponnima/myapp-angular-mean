var mongoose = require('mongoose');

var FlightSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  published_year: String,
  updated_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flight', FlightSchema);