const express = require('express');
const router = express.Router();

const {
  getProductByID,
  createProduct,
  getProduct,
  productPhoto,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require('../controllers/product');
const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth');
const { getUserByID } = require('../controllers/user');

// params
router.param('userID', getUserByID);
router.param('productID', getProductByID);

// actual routes

// create route
router.post(
  '/product/create/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// read routes
router.get('/product/:productID', getProduct);
router.get('/product/photo/:productID', productPhoto);

// delete route
router.delete(
  '/product/:productID/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);
// update route
router.put(
  '/product/:productID/:userID',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// listing route
router.get('/products', getAllProducts);

router.get('/products/categories', getAllUniqueCategories);

module.exports = router;
