import { useContext, useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Cart.css";
import { getCart } from "../../data/fetchingData";
import Loader from "../../components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/Cart/CartContext";
import { UserContext } from "../../context/User/UserContext";
import { getProductsById, updateOrCreateCart } from "../../data/PostingData";
import CartProduct from "../../components/Cart/CartProduct/CartProduct";
import { MdNavigateBefore } from "react-icons/md";
import { debounce } from "lodash";
import SubmitOrder from "../../components/Cart/SubmitOrder/SubmitOrder";

const Cart = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;

  const { cart, addToCart, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [cartProductIds, setCartProductIds] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [showSubmitOrder, setShowSubmitOrder] = useState(false);

  useEffect(() => {
    if (!user.status.isLoggedIn) navigate("/");
    if (cart.products.length !== 0) {
      // assigning the quantity property to each product in the products array
      setCartProductIds(cart.products);
      const cartProducts = getProductsById(cart.products);
      cartProducts.then((products) => {
        const updatedProducts = products.map((product) => {
          const cartProduct = cart.products.find(
            (cartItem) => cartItem.productId === product._id
          );
          if (cartProduct) {
            return {
              ...product,
              quantity: cartProduct.quantity,
            };
          } else {
            // If the product is not in the cart, return it as is
            return product;
          }
        });

        // Calculating the final price using the reduce function (the 0 which is the second argument in this function is the initial value of the total variable inside the reduce function)
        const newOrderPrice = updatedProducts.reduce(
          (total, product) => total + product.quantity * product.price,
          0
        );
        setTotalPrice(newOrderPrice);
        setProducts(updatedProducts);
      });
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [cart]);

  useEffect(() => {
    // handling the change in the quantity of the products
    const handleProductsUpdate = debounce(() => {
      if (products.length !== 0)
        if (cartProductIds !== cart.products) addToCart(cartProductIds);
    }, 1000);

    handleProductsUpdate();

    return () => {
      handleProductsUpdate.cancel();
    };
  }, [cartProductIds]);

  const handleExitCart = () => {
    if (products.length !== 0)
      if (cartProductIds !== cart.products) addToCart(cartProductIds);
    navigate(-1);
  };

  const removeProduct = (_id) => {
    removeFromCart(_id);
    const newProducts = products.filter((product) => {
      return product._id !== _id;
    });
    setProducts(newProducts);
  };

  return (
    <>
      <div className="home_link-container">
        <button onClick={() => handleExitCart()}>
          <MdNavigateBefore />
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="cart_container">
          {products.length === 0 ? (
            <>
              <p
                style={{
                  width: "100vw",
                  textAlign: "center",
                  margin: "1rem 0",
                }}
              >
                no Products in the cart
                <span>
                  <Link to={"/products"}> Add To Cart</Link>
                </span>
              </p>
            </>
          ) : (
            <div className="cart_products-container">
              {products.map((product) => {
                return (
                  <CartProduct
                    cartProductIds={cartProductIds}
                    setCartProductIds={setCartProductIds}
                    removeFromCart={removeFromCart}
                    key={product._id}
                    product={product}
                    removeProduct={removeProduct}
                  />
                );
              })}
            </div>
          )}
          {products.length !== 0 && (
            <div className="submit_cart">
              <h4>
                Total Price: <span>${totalPrice}</span>
              </h4>
              <button
                onClick={() => setShowSubmitOrder(true)}
                className="button-secondary"
              >
                Place Order
              </button>
              <button
                onClick={() => {
                  setProducts([]);
                  setTotalPrice(0);
                  addToCart([]);
                }}
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      )}

      {showSubmitOrder && (
        <SubmitOrder
          setShowSubmitOrder={setShowSubmitOrder}
          products={products}
          setProducts={setProducts}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          addToCart={addToCart}
        />
      )}
    </>
  );
};

export default Cart;
