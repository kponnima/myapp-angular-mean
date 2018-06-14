var mongoose = require('mongoose');

var AirportsSchema = new mongoose.Schema({
    airportcode: {
        type: String,
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
        required: false
    },
    countryname: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Airports', AirportsSchema);