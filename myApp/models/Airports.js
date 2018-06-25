var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AirportsSchema = new Schema({
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