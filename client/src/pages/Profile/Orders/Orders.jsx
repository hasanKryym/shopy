import React, { useState, useEffect } from "react";
import "./Orders.css";
import { useLocation } from "react-router-dom";
import OrdersFilter from "./OrdersFilter/OrdersFilter";
import { ORDERS_FILTER } from "./OrdersFilter/filters";
import { getOrders } from "../../../data/fetchingData";
import { NOTIFICATION_STATES } from "../../../components/Notification/notificationStates";
import Notification from "../../../components/Notification/Notification";
import { useNavigate } from "react-router-dom";
import { getProductsById } from "../../../data/PostingData";
import OrderProduct from "../../../components/OrderProduct/OrderProduct";
import { deleteOrder } from "../../../data/deletingData";
import { editOrderStatus } from "../../../data/updatingData";
import Order from "../../../components/Order/Order";
import { OrdersSearchFilter } from "../../../components/Admin/OrdersSearchFilter/OrdersSearchFilter";
import { orderSearch } from "../../../components/Admin/OrdersSearchFilter/orderSearch";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const Orders = ({ page, PAGES }) => {
  const location = useLocation();
  const currentUrl = location.pathname;

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [queryObject, setQueryObject] = useState({
    orderStatus: page === PAGES.MANAGE_ORDERS ? "" : ORDERS_FILTER.PENDING,
    getAllOrders: page === PAGES.MANAGE_ORDERS ? true : false,
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    state: "",
    message: "",
  });

  const [products, setProducts] = useState([]);

  const [selectedSearchFilter, setSelectedSearchFilter] = useState({
    filter: orderSearch.ORDER_ID,
    value: "",
  });

  const [pages, setPages] = useState({
    page: 1,
    maxPages: 1,
  });

  // Function to fetch data based on the selected filter
  const fetchOrders = async () => {
    setNotificationData({
      ...notificationData,
      message: `Loading ${queryObject.orderStatus} Orders`,
      state: NOTIFICATION_STATES.LOAD,
    });
    setShowNotification(true);
    const ordersData = await getOrders(queryObject);

    if (ordersData.success) {
      setPages({ ...pages, maxPages: ordersData.maxPages });
      fetchProducts(ordersData.orders);
    } else if (!ordersData.success && ordersData.msg === "no orders") {
      setOrders([]);
      setShowNotification(false);
    } else if (ordersData.msg === "Invalid ObjectId provided") {
      setNotificationData({
        ...notificationData,
        message: ordersData.msg,
        state: NOTIFICATION_STATES.INFO,
      });

      setTimeout(() => {
        setShowNotification(false);
        navigate("/profile");
      }, 3000);
    } else {
      setNotificationData({
        ...notificationData,
        message: `An error occurred`,
        state: NOTIFICATION_STATES.ERROR,
      });

      setTimeout(() => {
        setShowNotification(false);
        navigate("/profile");
      }, 3000);
    }
  };

  const fetchProducts = async (orders) => {
    const productIds = orders.flatMap((order) =>
      order.products.map((product) => product.productId)
    );

    const uniqueProductIds = [...new Set(productIds)];

    const productsData = await getProductsById(uniqueProductIds);
    if (productsData) {
      setProducts(productsData);
    } else {
      setNotificationData({
        ...notificationData,
        message: `An error occurred`,
        state: NOTIFICATION_STATES.ERROR,
      });

      setTimeout(() => {
        setShowNotification(false);
        navigate("/profile");
      }, 3000);
    }

    assignProductsToOrders(productsData, orders);
  };

  const assignProductsToOrders = async (productsData, ordersData) => {
    ordersData.forEach((order) => {
      order.products.forEach((product) => {
        const matchingProductData = productsData.find(
          (productData) => product.productId === productData._id
        );

        if (matchingProductData) {
          // Replace the entire product object with the matching productData
          Object.assign(product, matchingProductData);
        }
      });
    });

    setOrders(ordersData);
    setShowNotification(false);
  };
  //   useEffect(() => {}, [orders]);

  // useEffect to trigger data fetching when the selectedFilter changes
  useEffect(() => {
    fetchOrders();
  }, [queryObject]);

  // DELETING AN ORDER

  const handleCancelOrder = async (id, createdAt) => {
    setNotificationData({
      ...notificationData,
      message: `Canceling Order`,
      state: NOTIFICATION_STATES.LOAD,
    });
    setShowNotification(true);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const createdAtDate = new Date(createdAt); // Convert createdAt to a Date object

    if (createdAtDate <= oneDayAgo) {
      setNotificationData({
        ...notificationData,
        message: "Order cannot be canceled. It is older than 1 day.",
        state: NOTIFICATION_STATES.ERROR,
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return;
    }

    const canceledOrder = await editOrderStatus(id, ORDERS_FILTER.CANCELED);
    if (canceledOrder.success) {
      setNotificationData({
        ...notificationData,
        message: canceledOrder.msg,
        state: NOTIFICATION_STATES.SUCCESS,
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } else {
      setNotificationData({
        ...notificationData,
        message: canceledOrder.msg,
        state: NOTIFICATION_STATES.ERROR,
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const handleDeleteOrder = async (id) => {
    setNotificationData({
      ...notificationData,
      message: `Deleting Order`,
      state: NOTIFICATION_STATES.LOAD,
    });
    setShowNotification(true);

    const deletedOrder = await deleteOrder(id);
    if (deletedOrder.success) {
      setNotificationData({
        ...notificationData,
        message: deletedOrder.msg,
        state: NOTIFICATION_STATES.SUCCESS,
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    } else {
      setNotificationData({
        ...notificationData,
        message: deletedOrder.msg,
        state: NOTIFICATION_STATES.ERROR,
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  const handleSubmitSearch = () => {
    if (!selectedSearchFilter.value) {
      setNotificationData({
        ...notificationData,
        message: "please enter an id",
        state: NOTIFICATION_STATES.INFO,
      });
      setShowNotification(true);

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return;
    }
    if (selectedSearchFilter.filter === orderSearch.ORDER_ID)
      setQueryObject({
        ...queryObject,
        orderStatus: "",
        orderId: selectedSearchFilter.value,
      });
    else if (selectedSearchFilter.filter === orderSearch.USER_ID)
      setQueryObject({
        ...queryObject,
        orderStatus: "",
        userId: selectedSearchFilter.value,
      });
    // else if (selectedSearchFilter.filter === orderSearch.USER_NAME)
    // setQueryObject({ ...queryObject, name: selectedSearchFilter.value });
  };

  const handleEditOrderStatus = async (id, status) => {
    if (!id || !status) return;
    setNotificationData({
      ...notificationData,
      message: "updating State",
      state: NOTIFICATION_STATES.LOAD,
    });
    setShowNotification(true);
    const response = await editOrderStatus(id, status);
    if (response.success) {
      setNotificationData({
        ...notificationData,
        message: response.msg,
        state: NOTIFICATION_STATES.SUCCESS,
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    } else {
      setNotificationData({
        ...notificationData,
        message: response.msg,
        state: NOTIFICATION_STATES.ERROR,
      });

      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  return (
    <>
      {showNotification && (
        <Notification
          message={notificationData.message}
          state={notificationData.state}
        />
      )}
      <div className="orders_container">
        <OrdersFilter
          selectedFilter={queryObject.orderStatus}
          setQueryObject={setQueryObject}
        />

        {page && page === PAGES.MANAGE_ORDERS && (
          <div>
            <OrdersSearchFilter
              selectedSearchFilter={selectedSearchFilter}
              setSelectedSearchFilter={setSelectedSearchFilter}
              handleSubmitSearch={handleSubmitSearch}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
          className="navigation_buttons"
        >
          <button
            onClick={() => {
              const currentPage = pages.page;
              if (currentPage > 1) {
                setPages({ ...pages, page: currentPage - 1 });
                setQueryObject({ ...queryObject, page: currentPage - 1 });
              }
            }}
            className="navigation-button"
          >
            <MdNavigateBefore />
          </button>
          <div>
            {pages.page}/{pages.maxPages}
          </div>
          <button
            onClick={() => {
              const currentPage = pages.page;
              if (currentPage < pages.maxPages) {
                setPages({ ...pages, page: currentPage + 1 });
                setQueryObject({ ...queryObject, page: currentPage + 1 });
              }
            }}
            className="navigation-button"
          >
            <MdNavigateNext />
          </button>
        </div>

        {orders.length !== 0
          ? orders.map((order) => {
              // let orderTotalPrice = 0;
              return (
                <Order
                  key={order._id}
                  order={order}
                  selectedFilter={queryObject.orderStatus}
                  showNotification={showNotification}
                  handleCancelOrder={handleCancelOrder}
                  handleDeleteOrder={handleDeleteOrder}
                  handleEditOrderStatus={handleEditOrderStatus}
                  page={page}
                  PAGES={PAGES}
                />
              );
            })
          : !showNotification && <div>No {queryObject.orderStatus} orders</div>}
      </div>
    </>
  );
};

export default Orders;
