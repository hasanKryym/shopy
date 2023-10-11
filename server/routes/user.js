const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser,
  createUser,
  updateOrCreateCart,
  getCart,
  updateOrCreateWishlist,
  getWishlist,
} = require("../controllers/user");
const checkAdmin = require("../middleware/checkAdmin");

router.route("/:id").get(getUser).patch(updateUser);
router.route("/manage/create").post(createUser);
router.route("/manage/cart").post(updateOrCreateCart).get(getCart);
router.route("/manage/wishlist").post(updateOrCreateWishlist).get(getWishlist);

module.exports = router;
