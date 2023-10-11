const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");

const getUser = asyncWrapper(async (req, res) => {
  const { id: user_id } = req.params;
  const user = await User.findById(user_id).select("-password -_id");
  if (!user) throw new NotFoundError("User not found");
  return res.status(StatusCodes.OK).json(user);
});

const updateUser = asyncWrapper(async (req, res) => {
  const { id: user_id } = req.params;
  const { inputs } = req.body;
  if (!inputs) throw new BadRequestError("please provide inputs value");
  const user = await User.findByIdAndUpdate(user_id, inputs, {
    new: true,
  }).select("-password");

  if (!user) throw new NotFoundError("User not found");

  return res
    .status(StatusCodes.OK)
    .json({ success: true, user, msg: "user Updated successfully" });
});

const createUser = asyncWrapper(async (req, res) => {
  const { inputs } = req.body;
  if (!inputs) throw new BadRequestError("Please provide inputs value");
  const existingUser = await User.findOne({ email: inputs.email });
  if (existingUser) {
    throw new BadRequestError("Email already exists");
  }
  let user = await User.create({ ...inputs });
  user = user.toObject(); // Convert the Mongoose document to a plain JavaScript object
  delete user.password;
  return res.status(StatusCodes.CREATED).json({ success: true, user });
});

//////////////////////////////////// CART ////////////////////////////////////

// INPUTS
// {
//   userId: 'your-user-id', // Replace with the actual user ID
//   products: [
//     {
//       productId: 'product-id-1', // Replace with the actual product ID
//       quantity: 3,
//     },
//     {
//       productId: 'product-id-2', // Replace with the actual product ID
//       quantity: 1,
//     },
//   ],
// }
const updateOrCreateCart = asyncWrapper(async (req, res) => {
  const { user_id } = req.user;
  const { inputs } = req.body;
  let cart;
  if (!user_id) throw new UnauthenticatedError("Unauthenticated");
  if (!inputs) throw new BadRequestError("Please provide the cart products");

  const productData = inputs.products;
  const existingCart = await Cart.findOne({ userId: user_id });

  if (existingCart) {
    existingCart.products = productData;
    await existingCart.save();
    cart = existingCart;
    // console.log('Cart updated successfully:', cart);
  } else {
    console.log("called");
    const newCart = new Cart(inputs);
    await newCart.save();
    cart = newCart;
    // console.log('New cart created successfully:', cart);
  }

  return res.status(StatusCodes.OK).json({ success: true, cart });
});

const getCart = asyncWrapper(async (req, res) => {
  const { user_id } = req.user;
  if (!user_id) throw new UnauthenticatedError("Unauthenticated");
  let cartData = await Cart.find({ userId: user_id });

  if (cartData.length === 0) {
    cartData = {
      userId: user_id,
      products: [],
    };

    cartData = await Cart.create(cartData);
    cartData = [cartData];
  }
  cartData = cartData[0];

  return res.status(StatusCodes.OK).json(cartData);
});

//////////////////////////////////// Wishlist ////////////////////////////////////

const updateOrCreateWishlist = asyncWrapper(async (req, res) => {
  const { user_id } = req.user;
  const { productId, action } = req.body;

  if (!user_id) throw new UnauthenticatedError("Unauthenticated");
  if (!action)
    throw new BadRequestError(
      "Please provide the action(add, remove, or empty)"
    );
  if (!productId && action !== "empty")
    throw new BadRequestError("Please provide the productId");

  let wishlist = await Wishlist.findOne({ userId: user_id });

  if (!wishlist) {
    wishlist = new Wishlist({ userId: user_id, products: [productId] });
  } else {
    if (action === "add") {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    } else if (action === "remove") {
      wishlist.products = wishlist.products.filter((existingProductId) => {
        existingProductId = existingProductId.toString();
        return existingProductId !== productId;
      });
    } else if (action === "empty") {
      wishlist.products = [];
    }
  }

  await wishlist.save();

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "wishlist updated successfully" });
});

const getWishlist = asyncWrapper(async (req, res) => {
  const { user_id } = req.user;
  let wishlist = await Wishlist.findOne({ userId: user_id });

  if (!wishlist) return res.status(StatusCodes.OK).json(wishlist);

  return res.status(StatusCodes.OK).json(wishlist);
});

module.exports = {
  getUser,
  updateUser,
  createUser,
  updateOrCreateCart,
  getCart,
  updateOrCreateWishlist,
  getWishlist,
};
