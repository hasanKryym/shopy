const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");

const checkUserStatus = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    // console.log(user);
    if (user.role.position === "admin") req.admin = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkUserStatus;
