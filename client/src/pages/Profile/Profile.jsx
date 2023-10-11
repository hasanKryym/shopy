import { useContext, useEffect, useState } from "react";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar";
import { UserContext } from "../../context/User/UserContext";
import MyDetails from "./MyDetails/MyDetails";
import Sidebar from "./Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import Dashboard from "../Admin/Dashboard/Dashboard";
import AddProduct from "../Admin/AddProducts/AddProduct";
import Wishlist from "./Wishlist/Wishlist";
import Orders from "./Orders/Orders";
import ManageOrders from "../Admin/ManageOrders/ManageOrders";

const Profile = () => {
  const PAGES = {
    MY_DETAILS: "myDetails",
    ORDERS: "orders",
    WISHLIST: "wishlist",
    DASHBOARD: "dashboard",
    ADD_PRODUCT: "addProduct",
    MANAGE_ORDERS: "manageOrders",
  };
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;
  const [page, setPage] = useState(PAGES.MY_DETAILS);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user.status.isLoggedIn) navigate("/");
  }, []);

  return (
    <>
      <Navbar />
      <div className="container profile_container">
        <Sidebar page={page} setPage={setPage} PAGES={PAGES} />
        <div className="container profile_content-container">
          {page === PAGES.MY_DETAILS && <MyDetails />}
          {page === PAGES.WISHLIST && <Wishlist PAGES={PAGES} page={page} />}
          {page === PAGES.DASHBOARD && (
            <Dashboard setPage={setPage} PAGES={PAGES} />
          )}
          {page === PAGES.ADD_PRODUCT && (
            <AddProduct setPage={setPage} PAGES={PAGES} />
          )}

          {page === PAGES.ORDERS && <Orders page={page} PAGES={PAGES} />}
          {page === PAGES.MANAGE_ORDERS && (
            <ManageOrders page={page} PAGES={PAGES} />
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
