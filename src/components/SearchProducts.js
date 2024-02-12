import React from "react";

const SearchProducts = ({ searchTerm, onSearchChange }) => {
  const handleInputChange = (event) => {
    onSearchChange(event.target.value);
  };

  const handlePress = (event) => {
    onSearchChange("");
  };

  return (
    <div className="search-container">
      {" "}
      {/* Envoltura para centrar y estilizar */}
      <input
        type="text"
        placeholder=""
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input" // Aplicamos clases de estilo
      />
      <button className="buttonSearch" onClick={handlePress}>X</button>
    </div>
  );
};

export default SearchProducts;
