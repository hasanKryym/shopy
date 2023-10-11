const express = require("express");
const router = express.Router();

const checkAdmin = require("../middleware/checkAdmin");
const {
  getOrders,
  addOrder,
  deleteOrder,
  editOrderStatus,
} = require("../controllers/orders");
const checkUserStatus = require("../middleware/checkUserStatus");

router.route("/").get(checkUserStatus, getOrders).post(addOrder);
router
  .route("/:id")
  .delete(deleteOrder)
  .patch(checkUserStatus, editOrderStatus);

module.exports = router;
