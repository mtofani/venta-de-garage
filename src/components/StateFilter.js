import React from "react";

const StateFilter = ({ productStateFilter, handleProductStateFilter }) => {
  return (
    <div className="stateFilter">
      <span className="spanFilter">Ver: </span>
      <select className="" value={productStateFilter} onChange={handleProductStateFilter}>
        <option value="available">Disponible</option>
        <option value="sold">Vendido</option>
        <option value="reserved">Reservado</option>
      </select>
    </div>
  );
};

export default StateFilter;
