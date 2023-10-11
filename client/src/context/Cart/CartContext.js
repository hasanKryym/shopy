import { createContext, useContext, useEffect, useState } from "react";
import { getCart } from "../../data/fetchingData";
import { UserContext } from "../User/UserContext";

export const CartContext = createContext();

export const CartProvider = (props) => {
  const { updateOrCreateCart } = require("../../data/PostingData");

  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;

  const [cart, setCart] = useState({
    userId: localStorage.getItem("user_id"),
    products: [],
  });

  useEffect(() => {
    (async () => {
      try {
        if (user.status.isLoggedIn) {
          const cartData = await getCart();
          setCart(cartData);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    })();
  }, [user]);

  const addToCart = (productsData) => {
    // send an empty array if you want to clear the user cart
    if (productsData.length === 0) {
      setCart({ ...cart, products: [] });
      updateOrCreateCart({ ...cart, products: [] });
      return;
    }

    // Loop through the products in productsData
    productsData.forEach((product) => {
      // Find the corresponding product in the cart
      const cartProductIndex = cart.products.findIndex(
        (cartProduct) => cartProduct.productId === product.productId
      );

      if (cartProductIndex !== -1) {
        // If the product is found in the cart, update its quantity
        if (product.quantity === 0) {
          // If the quantity is 0, remove the product from the cart
          cart.products.splice(cartProductIndex, 1);
        } else {
          // Otherwise, update the quantity
          cart.products[cartProductIndex].quantity = product.quantity;
        }
      } else {
        // If the product is not found in the cart and its quantity is greater than 0, add it to the cart
        if (product.quantity > 0) {
          cart.products.push({
            productId: product.productId,
            quantity: product.quantity,
          });
        }
      }
    });

    // Update the cart state
    setCart({ ...cart });
    updateOrCreateCart(cart);
  };

  const removeFromCart = (productId) => {
    let updatedProducts = [];
    setCart((prevCart) => {
      updatedProducts = prevCart.products.filter(
        (product) => product.productId !== productId
      );
      return { ...prevCart, products: updatedProducts };
    });

    const newCart = {
      userId: localStorage.getItem("user_id"),
      products: updatedProducts,
    };
    console.log(newCart.products);

    updateOrCreateCart(newCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {props.children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
