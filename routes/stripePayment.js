const express = require('express');
const router = express.Router();
const { makePayment } = require('../controllers/stripePayment');

router.post('/stripepayment');

module.exports = router;
