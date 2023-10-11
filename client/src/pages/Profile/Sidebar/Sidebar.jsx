import "./Sidebar.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/User/UserContext";
import { FaRegUserCircle } from "react-icons/fa";
import { AiFillShopping } from "react-icons/ai";
import { BsFillBagHeartFill, BsTruck } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";

const Sidebar = ({ page, setPage, PAGES }) => {
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;
  const navigate = useNavigate();

  return (
    <>
      <ul className="profile_sidebar-list">
        <li
          onClick={() => setPage(PAGES.MY_DETAILS)}
          className={`${page === PAGES.MY_DETAILS && "isSelected"}`}
        >
          <FaRegUserCircle /> My details
        </li>
        <li
          onClick={() => setPage(PAGES.ORDERS)}
          className={`${page === PAGES.ORDERS && "isSelected"}`}
        >
          <AiFillShopping /> My orders
        </li>
        <li
          onClick={() => setPage(PAGES.WISHLIST)}
          className={`${page === PAGES.WISHLIST && "isSelected"}`}
        >
          <BsFillBagHeartFill /> Wishlist
        </li>
        {user.data.role.position === "admin" && (
          <li
            onClick={() => setPage(PAGES.DASHBOARD)}
            className={`${page === PAGES.DASHBOARD && "isSelected"}`}
          >
            <RiAdminLine /> Dashboard
          </li>
        )}

        {user.data.role.position === "admin" && (
          <li
            onClick={() => setPage(PAGES.MANAGE_ORDERS)}
            className={`${page === PAGES.MANAGE_ORDERS && "isSelected"}`}
          >
            <BsTruck /> Manage orders
          </li>
        )}
        <li
          onClick={() => {
            localStorage.clear();

            setUser({
              status: {
                isLoggedIn: localStorage.getItem("token") ? true : false,
                user_id: localStorage.getItem("user_id"),
                token: localStorage.getItem("token"),
              },
              data: {
                name: "",
                email: "",
                address: "",
                number: "",
                role: {
                  position: "",
                  company: "",
                },
              },
            });

            navigate("/");
          }}
        >
          <BiLogOut /> logout
        </li>
      </ul>
    </>
  );
};

export default Sidebar;
