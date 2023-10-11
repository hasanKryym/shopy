import "./Product.css";
import { useContext, useState } from "react";
import { LiaCartArrowDownSolid } from "react-icons/lia";
import { AiOutlineHeart } from "react-icons/ai";
import { useCart } from "../../context/Cart/CartContext";
import CartPopUp from "../Cart/CartPopUp/CartPopUp";
import { UserContext } from "../../context/User/UserContext";
import { Link, useLocation } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsHeartbreakFill, BsHeartbreak, BsBookmarkStar } from "react-icons/bs";
import {
  addSliderProduct,
  updateOrCreateWishlist,
} from "../../data/PostingData";

// import { ToastContainer, toast } from "react-toastify";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const Product = ({
  product,
  handleDeleteProduct,
  PAGES,
  page,
  filterWishlistProducts,
}) => {
  const { _id, name, description, image, price, category, recommendedFor } =
    product;

  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;

  const [showPopup, setShowPopup] = useState(false);

  const { cart, addToCart, removeFromCart } = useCart();

  const location = useLocation();
  const currentUrl = location.pathname;

  const handleSliderProducts = async (action) => {
    const response = await toast.promise(addSliderProduct(_id, action), {
      pending: "pending",
      success: `Product ${action}ed to the slider`,
      error: "err",
    });
    // console.log(response);
  };

  const handleAddToWishList = async (action) => {
    const response = await toast.promise(updateOrCreateWishlist(_id, action), {
      pending: "pending",
      success: `Product ${action}ed to wishlist`,
      error: "err",
    });
    // console.log(response);
  };

  return (
    <>
      <article className="product">
        <header className="product_header">
          <div className="main-content">
            <div className="product_details">
              <h4>{name}</h4>
              <p style={{ fontWeight: "bolder", fontSize: "20px" }}>
                <span>$</span>
                {price}
              </p>
            </div>

            <div className="product_action">
              {currentUrl === "/profile" &&
              user.data.role.position === "admin" &&
              !page ? (
                <BsBookmarkStar
                  onClick={() => handleSliderProducts("add")}
                  title="Add to slider"
                  className="products_icon"
                />
              ) : (
                <LiaCartArrowDownSolid
                  title="Add to cart"
                  className="products_icon"
                  onClick={() => {
                    if (!user.status.isLoggedIn) {
                      alert("please login");
                      return;
                    }
                    setShowPopup(true);
                  }}
                />
              )}

              {currentUrl === "/profile" &&
              user.data.role.position === "admin" &&
              !page ? (
                <RiDeleteBin5Fill
                  title="Delete product"
                  className="products_icon"
                  onClick={() => handleDeleteProduct(_id)}
                />
              ) : page && page === PAGES.WISHLIST ? (
                <BsHeartbreak
                  title="remove product"
                  className="products_icon"
                  onClick={() => {
                    filterWishlistProducts(_id);
                    updateOrCreateWishlist(_id, "remove");
                  }}
                />
              ) : (
                <AiOutlineHeart
                  title="Add to wishlist"
                  className="products_icon"
                  onClick={() => {
                    if (!user.status.isLoggedIn) {
                      alert("please login");
                      return;
                    }
                    handleAddToWishList("add");
                  }}
                />
              )}
            </div>
          </div>
          {currentUrl === `/products/details/${_id}` && <p>{description}</p>}
        </header>

        <Link to={`/products/details/${_id}`}>
          <img src={image} alt="" />
        </Link>

        {showPopup && <CartPopUp setShowPopup={setShowPopup} {...product} />}
      </article>
    </>
  );
};

export default Product;
