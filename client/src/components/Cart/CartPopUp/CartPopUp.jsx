import "./CartPopUp.css";
import { useCart } from "../../../context/Cart/CartContext";
import { useState } from "react";

const CartPopUp = ({
  _id,
  name,
  description,
  image,
  price,
  category,
  recommendedFor,
  setShowPopup,
}) => {
  const { cart, addToCart, removeFromCart } = useCart();

  const [productObj, setProductObj] = useState({
    productId: _id,
    quantity: 1,
  });

  return (
    <>
      <section className="cart_popup-container">
        <input
          style={{ width: "100%" }}
          className="input"
          type="number"
          min="1"
          value={productObj.quantity}
          readOnly
        />
        <div className="buttons_container">
          <button
            onClick={() => {
              if (productObj.quantity > 1)
                setProductObj({
                  ...productObj,
                  quantity: productObj.quantity - 1,
                });
            }}
            className="button-primary"
          >
            -
          </button>
          <button
            onClick={() => {
              setProductObj({
                ...productObj,
                quantity: productObj.quantity + 1,
              });
            }}
            className="button-primary"
          >
            +
          </button>
        </div>

        <button
          onClick={() => {
            addToCart([productObj]);
            setShowPopup(false);
          }}
          className="button-primary"
        >
          Add to cart
        </button>
        <button
          onClick={() => setShowPopup(false)}
          className="button-secondary"
        >
          Cancel
        </button>
      </section>
    </>
  );
};

export default CartPopUp;
