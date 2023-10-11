const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to the Product model
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

module.exports = Wishlist;
