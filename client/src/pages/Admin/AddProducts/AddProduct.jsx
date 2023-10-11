import { useContext, useEffect, useState } from 'react';
import './AddProduct.css';
import UplaodCare from '../../../components/UploadCare/UploadCare';
import { createProduct } from '../../../data/PostingData';
import { UserContext } from '../../../context/User/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../../components/Loader/Loader';
import { getCategories } from '../../../data/fetchingData';

const AddProduct = ({ setPage, PAGES }) => {
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;
  const [isLoading, setIsLoading] = useState(true);
  const [inputs, setInputs] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    category: '',
    recommendedFor: 'both',
  });
  const { name, description, image, price, category, recommendedFor } = inputs;
  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [chosenCategory, setChosenCategory] = useState('');

  useEffect(() => {
    const categoriesList = getCategories();
    categoriesList.then((res) => {
      setCategories(res);
      setIsLoading(false);
    });
  }, []);

  const genders = ['men', 'women', 'both'];
  const [showGenders, setShowGenders] = useState(false);

  const addProduct = (e) => {
    e.preventDefault();
    if (!name || !description || !image || !category || !price) {
      toast.info('Please fill all the inputs', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      return;
    }

    setIsLoading(true);
    const product = createProduct(user.data.role.company, inputs);
    product.then((response) => {
      if (response.success) {
        setIsLoading(false);
        toast.success('Product added successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setTimeout(() => {
          setPage(PAGES.DASHBOARD);
        }, 2000);
      } else
        toast.error('An error occurred please try again later', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <form className="add_product-form" onSubmit={(e) => addProduct(e)}>
          <div className="add_product-input">
            <label htmlFor="name">Product Name</label>
            <br />
            <input
              autoComplete="off"
              name="name"
              id="name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="add_product-input">
            <label htmlFor="description">Product description</label>
            <br />
            <input
              autoComplete="off"
              name="description"
              id="description"
              type="text"
              className="input"
              value={description}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="add_product-input">
            <label htmlFor="price">Product price</label>
            <br />
            <input
              autoComplete="off"
              name="price"
              id="price"
              type="number"
              className="input"
              value={price}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="add_product-input">
            <label htmlFor="category">Product category</label>
            <br />
            <input
              readOnly
              autoComplete="off"
              name="category"
              id="category"
              type="text"
              className="input"
              value={chosenCategory}
              onClick={() => setShowCategories(!showCategories)}
            />
            {showCategories && (
              <ul className="list_container">
                {categories.map((category) => {
                  return (
                    <li
                      key={category._id}
                      className="list_item"
                      onClick={() => {
                        setInputs((prevState) => {
                          return { ...prevState, category: category._id };
                        });
                        setChosenCategory(category.name);
                        setShowCategories(false);
                      }}
                    >
                      {category.name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="add_product-input">
            <label htmlFor="recommendedFor">Product recommendedFor</label>
            <br />
            <input
              readOnly
              autoComplete="off"
              name="recommendedFor"
              id="recommendedFor"
              type="text"
              className="input"
              value={recommendedFor}
              onClick={() => setShowGenders(!showGenders)}
            />

            {showGenders && (
              <ul className="list_container">
                {genders.map((gender, i) => {
                  return (
                    <li
                      key={i}
                      className="list_item"
                      onClick={() => {
                        setInputs((prevState) => {
                          return { ...prevState, recommendedFor: gender };
                        });
                        setShowGenders(false);
                      }}
                    >
                      {gender}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <span>Products Image: </span>
          <UplaodCare setInputs={setInputs} />
          <div className="buttons_container">
            <button className="button-primary" type="submit">
              Save
            </button>
            <button
              onClick={() => setPage(PAGES.DASHBOARD)}
              className="button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ToastContainer />
    </>
  );
};

export default AddProduct;
