import { useContext } from "react";
import "./Dashboard.css";
import { UserContext } from "../../../context/User/UserContext";
import { BsFillBagPlusFill } from "react-icons/bs";
import Products from "../../Products/Products";

const Dashboard = ({ setPage, PAGES }) => {
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;
  return (
    <>
      <div className="dashboard_header">
        <button
          onClick={() => setPage(PAGES.ADD_PRODUCT)}
          title="Add Product"
          className="button-secondary"
        >
          <BsFillBagPlusFill className="add_products" />
        </button>
      </div>

      <section className="products_container">
        <Products showNavbar={false} />
      </section>
    </>
  );
};

export default Dashboard;
