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

export const deleteProduct = async (product_id) => {
  try {
    updateConfig();
    const response = await axios.delete(
      `${server}/products/manage/delete/${product_id}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};

////////////////////////// ORDERS //////////////////////////

export const deleteOrder = async (orderId) => {
  try {
    updateConfig();
    const response = await axios.delete(`${server}/orders/${orderId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};
