import "./Order.css";
import OrderProduct from "../OrderProduct/OrderProduct";
import { ORDERS_FILTER } from "../../pages/Profile/Orders/OrdersFilter/filters";
import { ORDER_STATUS } from "./orderStatus";
import { useState } from "react";

const Order = ({
  order,
  selectedFilter,
  showNotification,
  handleCancelOrder,
  handleDeleteOrder,
  handleEditOrderStatus,
  page,
  PAGES,
}) => {
  let orderTotalPrice = 0;

  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus);

  return (
    <>
      <div key={order._id} className="order_container">
        <p>Order id: {order._id}</p>
        <p>User id: {order.userId}</p>
        <div className="product_created-at">
          Ordered On: {new Date(order.createdAt).toLocaleDateString()}
        </div>
        {page === PAGES.ORDERS && <p>Order status: {order.orderStatus}</p>}

        {order.products.map((product) => {
          orderTotalPrice += product.quantity * product.price;
          return <OrderProduct key={product._id} product={product} />;
        })}
        <div className="order-total_price">Total: ${orderTotalPrice}</div>
        {selectedFilter === ORDERS_FILTER.PENDING &&
          !showNotification &&
          page !== PAGES.MANAGE_ORDERS && (
            <button
              disabled={showNotification}
              style={{ margin: "1rem 1rem" }}
              className="button-secondary"
              onClick={() => {
                handleCancelOrder(order._id, order.createdAt);
              }}
            >
              Cancel order
            </button>
          )}

        {selectedFilter === ORDERS_FILTER.CANCELED &&
          !showNotification &&
          page !== PAGES.MANAGE_ORDERS && (
            <button
              disabled={showNotification}
              style={{ margin: "1rem 1rem" }}
              className="button-secondary"
              onClick={() => {
                handleDeleteOrder(order._id);
              }}
            >
              Delete
            </button>
          )}

        {page === PAGES.MANAGE_ORDERS && !showNotification && (
          <div>
            <label htmlFor="orderStatus">Order Status:</label>
            <select
              id="orderStatus"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                handleEditOrderStatus(order._id, e.target.value);
              }}
            >
              {Object.values(ORDER_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
