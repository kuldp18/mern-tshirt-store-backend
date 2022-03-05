const express = require('express');
const router = express.Router();

const {
  getUser,
  getUserByID,
  updateUser,
  userPurchaseList,
} = require('../controllers/user');
const { isAdmin, isAuthenticated, isSignedIn } = require('../controllers/auth');

router.param('userID', getUserByID);
router.get('/user/:userID', isSignedIn, isAuthenticated, getUser);
router.put('/user/:userID', isSignedIn, isAuthenticated, updateUser);
router.get(
  '/orders/user/:userID',
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

module.exports = router;
