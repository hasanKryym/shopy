const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const Company = require("../models/Company");
const Product = require("../models/Product");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const createProduct = asyncWrapper(async (req, res) => {
  const { id: company_id } = req.params;
  const { inputs } = req.body;
  if (!inputs) throw new BadRequestError("please provide the inputs");
  const product = await Product.create(inputs);
  await Company.findOneAndUpdate(
    { _id: company_id },
    { $push: { "companyInfo.products": product._id } }
  );
  return res.status(StatusCodes.CREATED).json({ success: true, product });
});

const deleteProduct = asyncWrapper(async (req, res) => {
  const { id: productId } = req.params;
  const admin = req.admin;
  if (!admin) throw new UnauthenticatedError("Unauthenticated");

  const companyId = admin.role.company;

  const updatedCompany = await Company.findByIdAndUpdate(
    companyId,
    {
      $pull: {
        "companyInfo.products": productId,
        "companyInfo.sliderProducts": productId,
      },
    },
    { new: true }
  ).exec();

  if (!updatedCompany) {
    console.log("Company not found");
    return;
  }

  // console.log("Company with removed product:", updatedCompany);

  await Product.deleteOne({ _id: productId });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "product deleted succesfully" });
});

const getProducts = asyncWrapper(async (req, res) => {
  const {
    company,
    name,
    recommendedFor,
    category,
    numericFilters,
    fields,
    sort,
    // getById,
    search,
  } = req.query;
  const queryObject = {};
  if (search) {
    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    });
    return res.status(StatusCodes.OK).json({ success: true, products });
  }

  if (company) queryObject.company = company;
  if (name) queryObject.name = name;
  if (recommendedFor) queryObject.recommendedFor = recommendedFor;
  if (recommendedFor === "men" || recommendedFor === "women")
    queryObject.recommendedFor = { $in: [recommendedFor, "both"] };
  if (category) queryObject.category = category;

  // if (getById) {
  //   const { productIds } = req.body;
  //   queryObject._id = { $in: productIds };
  // }

  let result = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else result = result.sort("-createdAt");

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const productCount = await Product.countDocuments(queryObject);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const maxPages = Math.ceil(productCount / limit);

  result = result.skip(skip).limit(limit);

  const products = await result;
  return res.status(StatusCodes.OK).json({ products, maxPages });
});

const getProductsById = asyncWrapper(async (req, res) => {
  //send an array of products or a single product
  const { productIds } = req.body;
  let ids = productIds;

  if (productIds[0].productId) {
    ids = productIds.map((product) => {
      return product.productId;
    });
  }

  const products = await Product.find({ _id: { $in: ids } });

  return res.status(StatusCodes.OK).json(products);
});

module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsById,
};
