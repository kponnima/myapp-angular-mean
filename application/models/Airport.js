var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var AirportSchema = new Schema({
    airportcode: {
        type: String,
        unique:true,
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
    { collection: 'airports' });

AirportSchema.plugin(autoIncrement.plugin, {
    model:'Airport',
    startAt: 1
});
module.exports = mongoose.model('Airport', AirportSchema);