import { useEffect, useState } from "react";
import "./Products.css";
import { useParams, useLocation } from "react-router-dom";
import { getCategories, getProducts } from "../../data/fetchingData";
import Loader from "../../components/Loader/Loader";
import Product from "../../components/Product/Product";
import Navbar from "../../components/Navbar/Navbar";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Search from "../../components/Search/Search";

const Products = ({ showNavbar }) => {
  const { deleteProduct } = require("../../data/deletingData");

  const { recommendedFor } = useParams();

  const location = useLocation();
  const currentLocation = location.pathname;

  if (showNavbar === undefined) showNavbar = true;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [quereyParameters, setQueryParameters] = useState({
    recommendedFor: recommendedFor ? recommendedFor : "",
  });
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const productsArr = getProducts(quereyParameters);
    productsArr.then((res) => {
      setProducts(res.products);
      setMaxPages(res.maxPages);
      setIsDataLoaded(true);
      setIsLoading(false);
    });
    // setTimeout(() => {
    // }, 2000);
  }, [quereyParameters]);

  useEffect(() => {
    const categoriesList = getCategories();
    categoriesList.then((res) => {
      setCategories(res);
      setIsDataLoaded(true);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setQueryParameters({ ...quereyParameters, recommendedFor });
  }, [recommendedFor]);

  const handleDeleteProduct = (_id) => {
    const newProducts = products.filter((product) => {
      return product._id !== _id;
    });

    setProducts(newProducts);
    deleteProduct(_id);
  };

  return (
    <>
      {showNavbar && <Navbar />}
      {!quereyParameters.recommendedFor && currentLocation !== "/" && (
        <Search />
      )}
      <div className="container">
        <div className="products_page">
          <header className="products_container-header">
            <h3>{recommendedFor} Products</h3>
            <div className="page_controller">
              <MdNavigateBefore
                onClick={() => {
                  if (page === 1) return;
                  setPage((prevState) => {
                    let newPage = prevState;
                    if (page > 1) newPage -= 1;
                    setQueryParameters({ ...quereyParameters, page: newPage });
                    return newPage;
                  });
                }}
                className="page_navigation-icons"
              />
              {page + " / " + maxPages}
              <MdNavigateNext
                onClick={() => {
                  if (page === maxPages) return;
                  setPage((prevState) => {
                    let newPage = prevState;
                    if (newPage < maxPages) newPage += 1;
                    setQueryParameters({ ...quereyParameters, page: newPage });
                    return newPage;
                  });
                }}
                className="page_navigation-icons"
              />
            </div>
            <div className="category_filter">
              <button
                onClick={($) => setShowCategories(!showCategories)}
                className="category_button button-secondary"
              >
                {activeFilter}{" "}
                <span>
                  {showCategories ? <AiFillCaretUp /> : <AiFillCaretDown />}
                </span>
              </button>
              <ul
                className={`products_categories ${
                  showCategories ? "scale-in-ver-top" : "scale-out-ver-top"
                }`}
              >
                <li
                  onClick={(e) => {
                    setQueryParameters({
                      ...quereyParameters,
                      category: "",
                      page: 1,
                    });
                    setPage(1);
                    setActiveFilter("All");
                    setShowCategories(false);
                  }}
                  className={`products_category ${
                    activeFilter === "All" && "active"
                  }`}
                >
                  All
                </li>
                {categories.map((category) => {
                  return (
                    <li
                      key={category._id}
                      onClick={(e) => {
                        setQueryParameters({
                          ...quereyParameters,
                          category: e.target.id,
                          page: 1,
                        });
                        setPage(1);
                        setActiveFilter(category.name);
                        setShowCategories(false);
                      }}
                      id={category._id}
                      className={`products_category ${
                        activeFilter === category.name && "active"
                      }`}
                    >
                      {category.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </header>

          {isLoading || !isDataLoaded ? (
            <Loader />
          ) : (
            <div className="products_container">
              {products.length !== 0 ? (
                products.map((product) => {
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
                        product={product}
                        handleDeleteProduct={handleDeleteProduct}
                      />
                    </div>
                  );
                })
              ) : (
                <p>No products from this category</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
