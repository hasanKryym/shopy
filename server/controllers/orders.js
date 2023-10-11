const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const Order = require("../models/Order");
const mongoose = require("mongoose");

const getOrders = asyncWrapper(async (req, res) => {
  const { userId, orderStatus, orderId, sort, getAllOrders } = req.query;

  const { user_id } = req.user;
  const isAdmin = req.admin ? true : false;
  const queryObject = {};

  if (!isAdmin) queryObject.userId = user_id;

  if (userId && !orderId && isAdmin) {
    if (mongoose.isValidObjectId(userId)) queryObject.userId = userId;
    else
      return res
        .status(StatusCodes.OK)
        .json({ success: false, msg: "Invalid ObjectId provided" });
  }
  if (orderId) {
    if (mongoose.isValidObjectId(orderId)) queryObject._id = orderId;
    else
      return res
        .status(StatusCodes.OK)
        .json({ success: false, msg: "Invalid ObjectId provided" });
  }

  if (orderStatus) queryObject.orderStatus = orderStatus; // order status can be "pending", "delivered", "canceled"

  if (getAllOrders === "false") queryObject.userId = user_id;

  let query = Order.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    query = query.sort(sortList);
  } else {
    query = query.sort("-createdAt");
  }

  const orderCount = await Order.countDocuments(queryObject);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const maxPages = Math.ceil(orderCount / limit);

  query = query.skip(skip).limit(limit);

  // const orders = await query;

  const orders = await query.exec();

  if (orders.length === 0)
    return res
      .status(StatusCodes.OK)
      .json({ success: false, msg: "no orders" });

  return res.status(StatusCodes.OK).json({ success: true, orders, maxPages });
});

const addOrder = asyncWrapper(async (req, res) => {
  const { userId, products, orderStatus } = req.body;

  const statusToUse = orderStatus || "pending";

  const newOrder = new Order({
    userId,
    products,
    orderStatus: statusToUse,
  });

  // Save the new order to the database
  await newOrder.save();

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, order: newOrder });
});

const deleteOrder = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Order not found." });
  }

  // const oneDayAgo = new Date();
  // oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // if (order.createdAt <= oneDayAgo) {
  //   return res.status(StatusCodes.OK).json({
  //     success: false,
  //     msg: "Order cannot be deleted. It is older than 1 day.",
  //   });
  // }

  const deletedOrder = await Order.findByIdAndRemove(orderId);

  if (!deletedOrder) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Order not found." });
  }

  return res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Order deleted successfully." });
});

const editOrderStatus = asyncWrapper(async (req, res) => {
  const { id: orderId } = req.params;
  const { orderStatus } = req.body; // ["pending", "delivered", "canceled"]
  const isAdmin = req.admin ? true : false;

  if (orderStatus === "canceled") {
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, msg: "Order not found." });
    }

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (order.createdAt <= oneDayAgo && !isAdmin) {
      return res.status(StatusCodes.OK).json({
        success: false,
        msg: "Order cannot be canceled. It is older than 1 day.",
      });
    }
  } else if (orderStatus === "deliverd" && !isAdmin) {
    throw new UnauthenticatedError("Access denied for non-admin users");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );

  if (!updatedOrder) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Order not found." });
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    order: updatedOrder,
    msg: `added to ${orderStatus} orders`,
  });
});

module.exports = {
  getOrders,
  addOrder,
  deleteOrder,
  editOrderStatus,
};
