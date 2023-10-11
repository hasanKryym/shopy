const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const Company = require("../models/Company");
const Category = require("../models/Category");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const createCompany = asyncWrapper(async (req, res) => {
  const { inputs } = req.body;
  // INPUTS
  // {
  //   companyName: '',
  //   companyAddress: '',
  //   companyInfo: { admins: [], products: [] }
  // }
  if (!inputs) throw new BadRequestError("please provide the inputs");
  const company = await Company.create(inputs);
  return res.status(StatusCodes.CREATED).json({ success: true, company });
});

////////////////////////////////////// CATEGORY //////////////////////////////////////

const CreateCategory = asyncWrapper(async (req, res) => {
  const { inputs } = req.body;
  if (!inputs) throw new BadRequestError("please provide the inputs");
  const category = await Category.create(inputs);
  return res.status(StatusCodes.CREATED).json({ success: true, category });
});

const getCategories = asyncWrapper(async (req, res) => {
  const categories = await Category.find({});
  return res.status(StatusCodes.OK).json(categories);
});

////////////////////////////////////// SLIDER //////////////////////////////////////

const addSliderProduct = asyncWrapper(async (req, res) => {
  const admin = req.admin;
  if (!admin) throw new UnauthenticatedError("Unauthenticated");

  const { id: productId } = req.params; // add this productId to the sliderProducts array

  if (!productId) throw new BadRequestError("please provide the productId");

  const { action } = req.body;

  if (!action)
    throw new BadRequestError(
      "Action not provided, please provide an action (add, remove)"
    );

  const company_id = admin.role.company;
  const company = await Company.findById(company_id);

  if (!company)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Company not found" });

  let msg = "";

  if (action === "add") {
    if (!company.companyInfo.sliderProducts.includes(productId)) {
      company.companyInfo.sliderProducts.push(productId);
      msg = "Product added successfully";
    } else {
      msg = "Product is already in the slider";
    }
  } else if (action === "remove") {
    company.companyInfo.sliderProducts =
      company.companyInfo.sliderProducts.filter(
        (id) => id.toString() !== productId
      );
    // console.log(company.companyInfo.sliderProducts);
    msg = "Product removed successfully";
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid action" });
  }

  await company.save();

  return res.status(StatusCodes.OK).json({ success: true, msg });
});

const getSliderProducts = asyncWrapper(async (req, res) => {
  const { id: companyId } = req.params;
  if (!companyId)
    throw new BadRequestError("Please provide company id in the params");
  const company = await Company.findById(companyId);
  if (!company)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, msg: "Company not found" });

  return res.status(StatusCodes.OK).json(company.companyInfo.sliderProducts);
});

module.exports = {
  createCompany,
  CreateCategory,
  getCategories,
  addSliderProduct,
  getSliderProducts,
};
