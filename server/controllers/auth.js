const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

const register = async (req, res) => {
  const { name, email, password, address, number } = req.body;
  if (!name || !email || !password || !address || !number)
    throw new BadRequestError('Please provide name, email, and password');
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email already exists');
  }
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ token, user: { id: user._id, name: user.name } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequestError('please provide email and password');
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid Credentials');
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials');

  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ token, user: { id: user._id, name: user.name } });
};

module.exports = {
  register,
  login,
};
