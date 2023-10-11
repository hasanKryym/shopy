import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/shopyLogo.png";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiOutlineBarsArrowDown, HiOutlineBarsArrowUp } from "react-icons/hi2";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/User/UserContext";

const Navbar = () => {
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;

  // const location = useLocation();
  // const currentPath = location.pathname;

  const navbarLinks = [
    {
      name: "home",
      link: "/",
    },
    {
      name: "products",
      link: "/products",
    },
    {
      name: "women",
      link: "/products/women",
    },
    {
      name: "men",
      link: "/products/men",
    },
    {
      name: "contact",
      link: "/contact",
    },
  ];
  const accountDetailsLinks = [
    {
      name: user.status.isLoggedIn ? "my account" : "login",
      link: user.status.isLoggedIn ? "/profile" : "/login",
    },
    {
      name: <AiOutlineShoppingCart style={{ fontSize: "24px" }} />,
      link: user.status.isLoggedIn ? "/cart" : "/login",
    },
  ];

  const [showMobileList, setShowMobileList] = useState(false);
  return (
    <>
      <nav className="navbar">
        <img className="logo" src={logo} alt="" />
        <ul className="nav-list">
          {navbarLinks.map((navLink, i) => {
            return (
              <li key={i} className={`list-item`}>
                <Link to={navLink.link}>{navLink.name}</Link>
              </li>
            );
          })}
        </ul>
        <div className="account_details">
          <ul className="nav-list">
            {accountDetailsLinks.map((link, i) => {
              return (
                <li key={i} className="list-item">
                  <Link to={link.link}>{link.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile navbar */}

        <button
          onClick={() => setShowMobileList(true)}
          className="button-secondary show-mobile_list"
        >
          <HiOutlineBarsArrowDown style={{ fontSize: "24px" }} />
        </button>

        <div
          className={`mobile-navbar ${
            showMobileList ? "slide-in-blurred-top" : "slide-out-blurred-top"
          }`}
        >
          <button
            onClick={() => setShowMobileList(false)}
            className="button-primary close-mobile_list"
          >
            <HiOutlineBarsArrowUp style={{ fontSize: "24px" }} />
          </button>

          <ul className="mobile-nav-list">
            {navbarLinks.map((navLink, i) => {
              return (
                <li key={i} className="mobile-list-item">
                  <Link to={navLink.link}>{navLink.name}</Link>
                </li>
              );
            })}

            {accountDetailsLinks.map((link, i) => {
              return (
                <li key={i} className="mobile-list-item">
                  <Link to={link.link}>{link.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
