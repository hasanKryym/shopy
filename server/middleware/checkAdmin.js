const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { UnauthenticatedError } = require('../errors');

const checkAdmin = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const user = await User.findById(user_id);
    if (user.role.position === 'admin') {
      req.admin = user;
      next();
    } else throw new UnauthenticatedError('Unauthenticated');
  } catch (error) {
    next(error);
  }
};

module.exports = checkAdmin;
