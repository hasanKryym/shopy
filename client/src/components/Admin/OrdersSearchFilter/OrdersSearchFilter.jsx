import { useState } from "react";
import "./OrdersSearchFilter.css";
import { orderSearch } from "./orderSearch";

export const OrdersSearchFilter = ({
  selectedSearchFilter,
  setSelectedSearchFilter,
  handleSubmitSearch,
}) => {
  const handleFilterChange = (event) => {
    setSelectedSearchFilter({
      ...selectedSearchFilter,
      filter: event.target.value,
    });
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitSearch();
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          marginBottom: "1rem",
        }}
      >
        <div>
          <label htmlFor="filterSelect">Search by:</label>
          <select
            id="filterSelect"
            value={selectedSearchFilter.filter}
            onChange={handleFilterChange}
          >
            {Object.entries(orderSearch).map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{ display: "flex", gap: "1rem", alignItems: "center" }}
          className="search_container"
        >
          <div className="input-container">
            <input
              className="input"
              type="text"
              autoComplete="off"
              placeholder={selectedSearchFilter.filter}
              onChange={(e) =>
                setSelectedSearchFilter({
                  ...selectedSearchFilter,
                  value: e.target.value,
                })
              }
              onKeyPress={handleEnterKeyPress}
            />
            <span></span>
          </div>
          <button
            onClick={() => handleSubmitSearch()}
            className="button-primary"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
};
