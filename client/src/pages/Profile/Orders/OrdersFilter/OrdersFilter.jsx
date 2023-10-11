import { useState } from "react";
import "./OrdersFilter.css";
import { ORDERS_FILTER } from "./filters";

const OrdersFilter = ({ selectedFilter, setQueryObject }) => {
  const handleFilterChange = (event) => {
    setQueryObject((prevState) => {
      if (event.target.value === ORDERS_FILTER.ALL) event.target.value = "";
      return { ...prevState, orderStatus: event.target.value };
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
