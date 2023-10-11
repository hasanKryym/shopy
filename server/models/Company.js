const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    unique: true,
  },
  companyAddress: String,
  companyInfo: {
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    sliderProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
