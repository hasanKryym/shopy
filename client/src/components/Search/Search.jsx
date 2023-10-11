import { useState } from "react";
import "./Search.css";
import { getProducts } from "../../data/fetchingData";
import { NOTIFICATION_STATES } from "../Notification/notificationStates";
import Notification from "../Notification/Notification";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    state: "",
    message: "",
  });

  const handleSearchClick = async () => {
    setSearchResults([]);
    if (!searchTerm) {
      setNotificationData({
        ...notificationData,
        message: "please enter a search value",
        state: NOTIFICATION_STATES.INFO,
      });
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return;
    }
    setNotificationData({
      ...notificationData,
      message: "Searching Products",
      state: NOTIFICATION_STATES.LOAD,
    });
    setShowNotification(true);

    const queryParams = { search: searchTerm };

    const response = await getProducts(queryParams);

    if (response.success) {
      if (response.products.length !== 0) {
        setSearchResults(response.products);
        setShowNotification(false);
      } else {
        setNotificationData({
          ...notificationData,
          message: "No Products",
          state: NOTIFICATION_STATES.INFO,
        });
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    } else {
      setNotificationData({
        ...notificationData,
        message: "An error occurred",
        state: NOTIFICATION_STATES.ERROR,
      });

      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  };

  // Function to handle input field change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick(); // Call the search function on Enter key press
    }
  };

  return (
    <>
      {showNotification && (
        <Notification
          message={notificationData.message}
          state={notificationData.state}
        />
      )}
      <div className="search-container">
        <div className="search-input_container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleInputChange}
            className="input"
            onKeyPress={handleEnterKeyPress}
          />
          <button onClick={handleSearchClick} id="search-button">
            Search
          </button>
        </div>
        <ul className="search-results">
          {searchResults.map((result) => (
            <li
              onClick={() => navigate(`/products/details/${result._id}`)}
              key={result._id}
            >
              <div className="result-content">
                <img src={result.image} alt="" />
                <span>{result.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Search;
