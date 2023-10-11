import { useState } from "react";
import "./ManageOrders.css";
import Notification from "../../../components/Notification/Notification";
import Orders from "../../Profile/Orders/Orders";

const ManageOrders = ({ page, PAGES }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    state: "",
    message: "",
  });

  return (
    <>
      {showNotification && (
        <Notification
          message={notificationData.message}
          state={notificationData.state}
        />
      )}
      <Orders page={page} PAGES={PAGES} />
    </>
  );
};

export default ManageOrders;
