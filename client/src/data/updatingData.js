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

////////////////////////// USER //////////////////////////

export const updateUser = async (user_id, inputs) => {
  try {
    updateConfig();
    const data = { inputs };
    const response = await axios.patch(
      `${server}/user/${user_id}`,
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

export const editOrderStatus = async (orderId, orderStatus) => {
  try {
    updateConfig();
    const data = { orderStatus };
    const response = await axios.patch(
      `${server}/orders/${orderId}`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error.response);
    throw error;
  }
};
