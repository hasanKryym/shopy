import "./Home.css";
import { useContext, useEffect } from "react";
import { UserContext } from "../../context/User/UserContext";
import Navbar from "../../components/Navbar/Navbar";
import Products from "../Products/Products";
import { useNavigate } from "react-router-dom";
import HomeSlider from "../../components/HomeSlider/HomeSlider";
import Search from "../../components/Search/Search";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;

  return (
    <>
      <Navbar />
      <Search />
      <HomeSlider />

      <Products showNavbar={false} />
    </>
  );
};

export default Home;
