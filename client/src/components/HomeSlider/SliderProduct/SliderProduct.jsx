import { updateOrCreateWishlist } from "../../../data/PostingData";
import "./SliderProduct.css";
import { useCart } from "../../../context/Cart/CartContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SliderProduct = ({
  _id,
  name,
  image,
  price,
  recommendedFor,
  description,
  createdAt,
  category,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Prevent navigation when clicking the buttons
  const handleAddToCartClick = (event) => {
    event.stopPropagation(); // Prevent navigation
    addToCart([
      {
        productId: _id,
        quantity: 1,
      },
    ]);
  };

  const handleAddToWishlistClick = async (event) => {
    event.stopPropagation(); // Prevent navigation
    const response = await toast.promise(updateOrCreateWishlist(_id, "add"), {
      pending: "pending",
      success: `Product added to wishlist`,
      error: "err",
    });
    // console.log(response);
  };
  return (
    <>
      <article
        onClick={() => navigate(`/products/details/${_id}`)}
        className="swiper_product"
      >
        <div className="product_details">
          <h3>{name}</h3>
          <p className="text">{description}</p>
          <div className="btns_container">
            <button
              onClick={(e) => handleAddToCartClick(e)}
              className="button-primary"
            >
              Add to cart
            </button>
            <button
              onClick={(e) => handleAddToWishlistClick(e)}
              className="button-secondary"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
        <img src={image} alt="" />
      </article>
    </>
  );
};

export default SliderProduct;
