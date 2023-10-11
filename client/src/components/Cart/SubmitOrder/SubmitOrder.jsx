import { Link } from "react-router-dom";
import "./SubmitOrder.css";

import { NOTIFICATION_STATES } from "../../../components/Notification/notificationStates";
import Notification from "../../../components/Notification/Notification";
import { useState } from "react";
import { addOrder } from "../../../data/PostingData";

const SubmitOrder = ({
  setShowSubmitOrder,
  products,
  setProducts,
  totalPrice,
  setTotalPrice,
  addToCart,
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    state: "",
    message: "",
  });

  const handleSubmitOrder = async () => {
    // [ { productId: '423423423', quantity: number } ... ]
    setNotificationData({
      ...notificationData,
      message: "Submitting order",
      state: NOTIFICATION_STATES.LOAD,
    });
    setShowNotification(true);
    const productsToSubmit = products.map((product) => {
      return {
        productId: product._id,
        quantity: product.quantity,
      };
    });

    const response = await addOrder(
      localStorage.getItem("user_id"),
      productsToSubmit
    );

    if (response.success) {
      setNotificationData({
        ...notificationData,
        message: "Order submitted successfully, please wait.",
        state: NOTIFICATION_STATES.SUCCESS,
      });
    } else {
      setNotificationData({
        ...notificationData,
        message: "An error accured please try again later",
        state: NOTIFICATION_STATES.ERROR,
      });
    }

    setTimeout(() => {
      setNotificationData({
        ...notificationData,
        message: "",
        state: "",
      });
      setShowNotification(false);
      setProducts([]);
      setTotalPrice(0);
      addToCart([]);

      setShowSubmitOrder(false);
    }, 3000);
  };
  return (
    <>
      {showNotification && (
        <Notification
          message={notificationData.message}
          state={notificationData.state}
        />
      )}
      <div className="order_submit-container">
        <div className="products-details">
          {products.map(
            ({
              _id,
              name,
              description,
              price,
              createdAt,
              category,
              quantity,
            }) => {
              return (
                <div key={_id} className="product-detail">
                  <h5>
                    <span>{quantity}</span> x {name}
                  </h5>
                  <p>
                    <span>Price: $</span>
                    {price * quantity}
                  </p>
                  <p></p>
                </div>
              );
            }
          )}

          <p className="total-price">Total: ${totalPrice}</p>
        </div>
        <p className="note-info">
          NOTE: Please note that we will collect your current address and phone
          number during the submission process. If you need to update this
          information, you can do so conveniently from your{" "}
          <Link to={"/profile"}>account</Link> settings before proceeding.
        </p>

        <p className="note-info">
          NOTE: You have 24 hours from the time of order placement to cancel
          your order; after that period, cancellations will not be allowed.
        </p>
        <div className="btns-container">
          <button
            disabled={showNotification}
            onClick={() => handleSubmitOrder()}
          >
            Submit Order
          </button>
          <button
            disabled={showNotification}
            onClick={() => setShowSubmitOrder(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default SubmitOrder;
