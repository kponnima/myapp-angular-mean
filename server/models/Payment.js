let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PaymentSchema = new Schema({
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
    required: false,
    unique: true
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
    type: String,
    required: false
  },
  status: {
    type: String,
    required: false
  }
},
{autoIndex: false},
{ collection: 'payments' });

module.exports = mongoose.model('Payment', PaymentSchema);