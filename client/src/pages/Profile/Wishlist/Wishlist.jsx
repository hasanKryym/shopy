import { useEffect, useState } from "react";
import "./Wishlist.css";
import { getWishlist } from "../../../data/fetchingData";
import {
  getProductsById,
  updateOrCreateWishlist,
} from "../../../data/PostingData";
import Loader from "../../../components/Loader/Loader";
import Product from "../../../components/Product/Product";
import { Link } from "react-router-dom";

const Wishlist = ({ PAGES, page }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productIds = getWishlist();
    productIds.then((res) => {
      if (res) {
        if (res.products.length !== 0) {
          const products = getProductsById(res.products);
          products.then((res) => {
            setWishlistProducts(res);
            setIsLoading(false);
          });
        }
      }
      setIsLoading(false);
    });
  }, []);

  const filterWishlistProducts = (_id) => {
    const filteredProducts = wishlistProducts.filter((product) => {
      return product._id !== _id;
    });

    setWishlistProducts(filteredProducts);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="wishlist_container">
            {wishlistProducts.length !== 0 ? (
              wishlistProducts.map((product) => {
                return (
                  <div
                    key={product._id}
                    style={{
                      width: "250px",
                      minWidth: "250px",
                      height: "300px",
                      minHeight: "300px",
                    }}
                  >
                    <Product
                      PAGES={PAGES}
                      product={product}
                      page={page}
                      filterWishlistProducts={filterWishlistProducts}
                    />
                  </div>
                );
              })
            ) : (
              <p>
                no products in wishlist{" "}
                <Link to={"/products"}>Add to wishlist</Link>
              </p>
            )}
          </div>
          {wishlistProducts.length !== 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <button
                style={{ padding: "5px 15px" }}
                onClick={() => {
                  setWishlistProducts([]);
                  updateOrCreateWishlist(null, "empty");
                }}
              >
                Clear
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Wishlist;
