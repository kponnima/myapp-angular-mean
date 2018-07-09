var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var AirportSchema = new Schema({
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
},
    { collection: 'airports' });

AirportSchema.plugin(autoIncrement.plugin, 'Airport');
module.exports = mongoose.model('Airport', AirportSchema);