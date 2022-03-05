const express = require('express');
const router = express.Router();

const {
  getCategoryByID,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  removeCategory,
} = require('../controllers/category');
const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth');
const { getUserByID } = require('../controllers/user');

// params
router.param('userID', getUserByID);
router.param('categoryID', getCategoryByID);

// actual routes

// create routes
router.post(
  '/category/create/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// read routes
router.get('/category/:categoryID', getCategory);
router.get('/categories', getAllCategory);

// update routes
router.put(
  '/category/:categoryID/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// delete routes
router.delete(
  '/category/:categoryID/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
