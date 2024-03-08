import React from "react";

const StateFilter = ({ productStateFilter, handleProductStateFilter }) => {
  return (
    <div className="stateFilter">
      <span className="spanFilter">State: </span>
      <select className="" value={productStateFilter} onChange={handleProductStateFilter}>
        <option value="All">All</option>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
        <option value="reserved">Reserved</option>
      </select>
    </div>
  );
};

export default StateFilter;
