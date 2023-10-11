import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import { useEffect, useState } from "react";
import { getProductsById } from "../../data/PostingData";
import Loader from "../../components/Loader/Loader";
import Product from "../../components/Product/Product";
import { MdOutlineNavigateBefore } from "react-icons/md";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id: product_id } = useParams();

  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProduct = getProductsById([{ productId: product_id }]);
    getProduct
      .then((res) => {
        setProduct(res[0]);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="product_details-container">
            <button
              style={{
                fontSize: "30px",
                padding: "5px 10px",
                margin: "0 0.5rem 1rem 0.5rem",
              }}
              onClick={() => navigate(-1)}
            >
              <MdOutlineNavigateBefore />
            </button>
            <div style={{ width: "100%", height: "fit-content" }}>
              <Product key={product._id} product={product} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
