const express = require('express');
const router = express.Router();
const { processPayment, getToken } = require('../controllers/paypalPayment');
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getUserByID } = require('../controllers/user');

router.get('/payment/gettoken/:userId', isSignedIn, isAuthenticated, getToken);

router.param('userId', getUserByID);

router.post(
  '/payment/braintree/:userId',
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
