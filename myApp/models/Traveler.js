var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TravelerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    pnrno: {
        type: String,
        required: true
    },
    traveler_id: {
        type: String,
        required: true,
        unique: true
    },
    travelerfirstname: {
        type: String,
        required: true
    },
    travelermiddlename: {
        type: String,
        required: false
    },
    travelerlastname: {
        type: String,
        required: true
    },
    traveleraddress: {
        type: String,
        required: true
    },
    travelerzipcode: {
        type: String,
        required: false
    },
    traveleremail: {
        type: String,
        required: true
    },
    travelerphone: {
        type: Number,
        required: false
    },
    travelerseatpreference: {
        type: String,
        required: false
    },
    travelerspecialservices: {
        type: String,
        required: false
    },
    travelermealpreference: {
        type: String,
        required: false
    },
    needpassport: {
        type: Boolean,
        required: true
    },
    passportno: {
        type: String,
        required: false
    },
    passportexpiry: {
        type: String,
        required: false
    },
    passportissuingcountry: {
        type: String,
        required: false
    },
    passportcountryofcitizenship: {
        type: String,
        required: false
    },
    passportcountryofresidence: {
        type: String,
        required: false
    },
    emergencycontactfirstname: {
        type: String,
        required: true
    },
    emergencycontactmiddlename: {
        type: String,
        required: false
    },
    emergencycontactlastname: {
        type: String,
        required: true
    },
    emergencycontactaddress: {
        type: String,
        required: true
    },
    emergencycontactzipcode: {
        type: String,
        required: false
    },
    emergencycontactemail: {
        type: String,
        required: true
    },
    emergencycontactphone: {
        type: Number,
        minlength: 9,
        required: false
    },
},
 { collection: 'travelers' });

module.exports = mongoose.model('Traveler', TravelerSchema);