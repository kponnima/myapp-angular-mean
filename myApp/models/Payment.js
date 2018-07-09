var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  card_id: {
    type: String,
    required: false
  },
  order_id: {
    type: String,
    required: false
  },
  customer_id: {
    type: String,
    required: false
  },
  last4: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  paid_status: {
    type: Boolean,
    required: false
  },
  currency: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: false
  },
  statement_description: {
    type: Number,
    required: false
  }
},
{ collection: 'payments' });

module.exports = mongoose.model('Payment', PaymentSchema);