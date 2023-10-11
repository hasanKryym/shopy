import axios from "axios";
const server = process.env.REACT_APP_HOST_URL;
let token = localStorage.getItem("token");

let config = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

const updateConfig = () => {
  if (token !== localStorage.getItem("token")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    token = localStorage.getItem("token");
  }
};

////////////////////////// PRODUCTS //////////////////////////

export const createProduct = async (company_id, inputs) => {
  try {
    updateConfig();
    const data = { inputs };
    const response = await axios.post(
      `${server}/products/manage/create/${company_id}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

export const getProductsById = async (productIds) => {
  // productIds can be a single id or an array of ids
  try {
    updateConfig();
    const response = await axios.post(
      `${server}/products`,
      { productIds },
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

////////////////////////// CART //////////////////////////

export const updateOrCreateCart = async (inputs) => {
  try {
    updateConfig();
    const data = { inputs };
    const response = await axios.post(
      `${server}/user/manage/cart`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

////////////////////////// Wishlist //////////////////////////

export const updateOrCreateWishlist = async (productId, action) => {
  try {
    updateConfig();
    const data = { productId, action }; // action: "add" / "remove"
    const response = await axios.post(
      `${server}/user/manage/wishlist`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

////////////////////////// HOMEPAGESLIDER //////////////////////////

export const addSliderProduct = async (productId, action) => {
  try {
    updateConfig();
    const data = { action }; // "add" / "remove"
    const response = await axios.post(
      `${server}/company/manage/homePageSlider/${productId}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

////////////////////////// ORDERS //////////////////////////

export const addOrder = async (userId, products, orderStatus) => {
  // products should be an array example products: [ { productId: '423423423', quantity: number } ... ]
  // orderStatus can be "pending", "delivered", "canceled" NOTE: you are allowed to not provide an orderStatus its default value is pending
  try {
    updateConfig();
    const data = { userId, products, orderStatus };
    const response = await axios.post(`${server}/orders`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};
