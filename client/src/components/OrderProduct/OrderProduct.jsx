// OrderProduct.jsx
import React from "react";
import "./OrderProduct.css";

const OrderProduct = ({ product }) => {
  const {
    _id,
    name,
    description,
    image,
    quantity,
    price,
    category,
    createdAt,
    productId,
  } = product;

  return (
    <div className="product_order-container">
      <img src={image} alt={name} className="product_image" />
      <div className="product_info">
        <div className="product_name">{name}</div>
        <div className="product_description">{description}</div>
        <div className="product_price">${price.toFixed(2)}</div>
        <div className="product_quantity">Quantity: {quantity}</div>
        {/* <div className="product_category">Category: {category}</div> */}
        {/* <div className="product_created-at">
          Ordered On: {new Date(createdAt).toLocaleDateString()}
        </div> */}
      </div>
    </div>
  );
};

export default OrderProduct;
