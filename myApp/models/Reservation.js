var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    pnrno: {
        type: String,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    card_token: {
        type: String,
        required: true
    },
    paymentstatus: {
        type: String,
        required: true
    },
    segment_count: {
        type: Number,
        required: true
    },
    segment_id: {
        type: String,
        required: true
    },
    flight_no: {
        type: Number,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    departuredatetime: {
        type: String,
        required: true
    },
    arrivaldatetime: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cabintype: {
        type: String,
        required: true
    },
    seatno: {
        type: String,
        required: true
    },
    passenger_count: {
        type: Number,
        required: true
    },
    traveler_id: {
        type: String,
        required: true
    }
},
 { collection: 'reservations' });

module.exports = mongoose.model('Reservation', ReservationSchema);