import { useEffect, useState, useCallback } from 'react';
import './CartProduct.css';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from 'react-icons/ai';
import { debounce } from 'lodash';
import Loader from '../../Loader/Loader';

const CartProduct = ({
  product,
  removeFromCart,
  cartProductIds,
  setCartProductIds,
  removeProduct,
}) => {
  const {
    name,
    description,
    price,
    recommendedFor,
    image,
    cratedAt,
    category,
    _id,
    quantity,
  } = product;

  const [productQuantity, setProductQuantity] = useState(quantity);
  const [productIndex, setProductIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getIndex();
  }, []);

  const getIndex = () => {
    const productIndexValue = cartProductIds.findIndex(
      (cartProduct) => cartProduct.productId === _id
    );
    setProductIndex(productIndexValue);
    setIsLoading(false);
  };

  const handleQuantityChange = useCallback(
    debounce((productQuantity) => {
      const updatedCartProductIds = [...cartProductIds];
      updatedCartProductIds[productIndex].quantity = productQuantity;
      setCartProductIds(updatedCartProductIds);
    }, 500),
    [productIndex]
  );

  // console.log(cartProductIds);
  return (
    <>
      <article className="cart_product">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <img src={image} alt={name} />
            <div className="product_details-container">
              <h4>{name}</h4>
              <div className="quantity_container">
                <button
                  onClick={() => {
                    setProductQuantity((prevState) => {
                      const newValue = prevState > 1 ? prevState - 1 : 1;
                      handleQuantityChange(newValue);
                      return newValue; // Return the new value for immediate update
                    });
                  }}
                >
                  <AiOutlineMinus />
                </button>
                <span>{productQuantity}</span>
                <button
                  onClick={() => {
                    setProductQuantity((prevState) => {
                      const newValue = prevState + 1;
                      handleQuantityChange(newValue);
                      return newValue;
                    });
                  }}
                >
                  <AiOutlinePlus />
                </button>
              </div>

              <p className="total price">${price * productQuantity}</p>

              <button onClick={() => removeProduct(_id)} title="remove product">
                <AiOutlineClose />
              </button>
            </div>
          </>
        )}
      </article>
    </>
  );
};

export default CartProduct;
