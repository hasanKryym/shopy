import { useState } from "react";
import "./OrdersFilter.css";
import { ORDERS_FILTER } from "./filters";

const OrdersFilter = ({ selectedFilter, setQueryObject, setPages }) => {
  const handleFilterChange = (event) => {
    setPages((prevState) => {
      return { ...prevState, page: 1 };
    });
    setQueryObject((prevState) => {
      if (event.target.value === ORDERS_FILTER.ALL) event.target.value = "";
      return { ...prevState, orderStatus: event.target.value, page: 1 };
    });
  };

  return (
    <div className="orders-filter">
      <label htmlFor="filter">Filter Orders:</label>
      <select
        id="filter"
        value={selectedFilter}
        onChange={handleFilterChange}
        className="filter-dropdown"
      >
        {Object.values(ORDERS_FILTER).map((filter) => (
          <option key={filter} value={filter}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrdersFilter;
