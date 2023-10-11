const express = require('express');
const router = express.Router();

const checkAdmin = require('../middleware/checkAdmin');
const {
  createProduct,
  getProducts,
  getProductsById,
  deleteProduct,
} = require('../controllers/products');
const authenticate = require('../middleware/authentication');

router
  .route('/manage/create/:id')
  .post(authenticate, checkAdmin, createProduct);

router
  .route('/manage/delete/:id')
  .delete(authenticate, checkAdmin, deleteProduct);

router.route('/').get(getProducts).post(getProductsById);

module.exports = router;
