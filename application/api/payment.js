/*
 *  Controller which handles api requests coming from the router.
 *  Payment API request controller
 */
'use strict';
const keyPublishable = process.env.PUBLISHABLE_KEY;
//const keySecret = process.env.SECRET_KEY;
const keySecret = 'sk_test_qBQ7uEhbyUahpxrNTf5c8ugz';

const Payment = require('../models/Payment');
const utils = require('../lib/utils');
const stripe = require('stripe')(keySecret);

/* POST PAYMENT */
async function savePayment(req, res) {
  //console.log(keySecret);
  await stripe.customers.create({
    email: req.headers.email,
    card: req.headers.token,
  })
    .then(customer =>
      await stripe.charges.create({
        amount: req.headers.amount,
        description: "Flight booking charge",
        currency: "usd",
        customer: customer.id,
        source: req.body.token,
        statement_descriptor: 'Flight booking charge',
        metadata: { order_id: req.headers.orderid }
      }))
    .then(charge => 
      await res.send({
      token: req.headers.token,
      card_id: charge.source.id,
      order_id: charge.metadata.order_id,
      customer_id: charge.customer,
      last4: charge.source.last4,
      brand: charge.source.brand,
      description: charge.description,
      paid_status: charge.paid,
      currency: charge.currency,
      amount: charge.amount,
      statement_description: charge.statement_descriptor,
      status: charge.status
    }
    ))
    .catch(err => {
      console.log("Error:", err);
      return await res.status(500).send({ error: "Purchase Failed" });
    });
}
/* SAVE Payment Card */
async function savePayment(req, res) {
  var token = await utils.getToken(req.headers);
  if (token) {
    var newPayment = new Payment({
      token: req.body.token,
      card_id: req.body.card_id,
      order_id: req.body.order_id,
      customer_id: req.body.customer_id,
      last4: req.body.last4,
      brand: req.body.brand,
      description: req.body.description,
      paid_status: req.body.paid_status,
      currency: req.body.currency,
      amount: req.body.amount,
      statement_description: req.body.statement_descriptor,
      status: req.body.status
    });
    newPayment.save(async (err) => {
      if (err) {
        return await res.json({ success: false, msg: 'Save payment cards failed.' });
      }
      return await res.json({ success: true, msg: 'Successful saved payment card info.' });
    });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* GET ALL PAYMENTCARDS data */
async function getAllPaymentCards(req, res) {
  var token = await utils.getToken(req.headers);
  if (token) {
    Payment.find({
    }, async (err, cards) => {
      if (err) return await next(err);
      if (!cards) {
        return await res.status(401).send({ success: false, msg: 'No cards were found.' });
      } else {
        return await res.json(cards);
      }
    });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}
/* GET PAYMENTCARD by TOKEN data */
async function getPaymentCardByToken(req, res) {
  var token = await utils.getToken(req.headers);
  if (token) {
    Payment.find({
      token: req.params.token
    }, async (err, cards) => {
      if (err) return await next(err);
      if (!cards) {
        return await res.status(401).send({ success: false, msg: 'No cards were found.' });
      } else {
        return await res.json(cards);
      }
    });
  } else {
    return await res.status(403).send({ success: false, msg: 'Unauthorized.' });
  }
}

module.exports = {
  getAllPaymentCards: getAllPaymentCards,
  getPaymentCardByToken: getPaymentCardByToken,
  savePayment: savePayment,
  savePaymentCard: savePaymentCard
}