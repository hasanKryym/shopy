import axios from "axios";
const server = process.env.REACT_APP_HOST_URL;
const token = localStorage.getItem("token");

const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

//////////////////////////// USER ////////////////////////////

export const getUser = async (user_id, token) => {
  try {
    config.headers.Authorization = `Bearer ${token}`;
    const response = await axios.get(`${server}/user/${user_id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

//////////////////////////// PRODUCTS ////////////////////////////

export const getProducts = async (queryParameters) => {
  try {
    const response = await axios.get(`${server}/products`, {
      params: queryParameters,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

export const getProductsById = async (productIds) => {
  try {
    const response = await axios.post(`${server}/products`, { productIds });

    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

///////////////////////////// CATEGORIES ////////////////////////////

export const getCategories = async () => {
  try {
    const response = await axios.get(
      `${server}/company/manage/category`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

///////////////////////////// CART ////////////////////////////

export const getCart = async () => {
  try {
    const response = await axios.get(`${server}/user/manage/cart`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

///////////////////////////// WISHLIST ////////////////////////////

export const getWishlist = async () => {
  try {
    const response = await axios.get(`${server}/user/manage/wishlist`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

////////////////////////// HOMEPAGESLIDER //////////////////////////

export const getSliderProducts = async () => {
  try {
    const response = await axios.get(
      `${server}/company/manage/homePageSlider/64f6f663e85485344878ef38`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

////////////////////////// ORDERS //////////////////////////

export const getOrders = async (queryObject) => {
  try {
    config.params = queryObject;
    const response = await axios.get(`${server}/orders`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};
