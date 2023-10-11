const express = require("express");
const router = express.Router();

const {
  createCompany,
  CreateCategory,
  getCategories,
  addSliderProduct,
  getSliderProducts,
} = require("../controllers/company");
const checkAdmin = require("../middleware/checkAdmin");

const authenticate = require("../middleware/authentication");

router.route("/manage/create").post(authenticate, checkAdmin, createCompany);
router.route("/manage/category").get(getCategories);
router
  .route("/manage/category/create")
  .post(authenticate, checkAdmin, CreateCategory);

router
  .route("/manage/homePageSlider/:id")
  .post(authenticate, checkAdmin, addSliderProduct)
  .get(getSliderProducts);

module.exports = router;
