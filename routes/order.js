const express = require('express');
const router = express.Router();

const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth');
const { getUserByID, pushOrderInPurchaseList } = require('../controllers/user');
const { updateStock } = require('../controllers/product');
const {
  getOrderByID,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require('../controllers/order');

// params
router.param('userID', getUserByID);
router.param('orderID', getOrderByID);

// actual routes

// create
router.post(
  '/order/create/:userID',
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
// read
router.get(
  '/order/all/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);
// status of order
router.get(
  '/order/status/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  '/order/:orderID/status/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
