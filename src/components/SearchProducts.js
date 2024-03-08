import React, { useState, useEffect } from "react";

const SearchProducts = ({ searchTerm, onSearchChange }) => {
  const [initialZoomLevel, setInitialZoomLevel] = useState(1);

  useEffect(() => {
    // Guardar el nivel de zoom inicial al cargar la página
    setInitialZoomLevel(document.body.getBoundingClientRect().width / window.innerWidth);
  }, []);

  const handleInputChange = (event) => {
    onSearchChange(event.target.value);
  };

  const handlePress = (event) => {
    onSearchChange("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Intro") {
      // Hacer scroll hacia abajo
      window.scrollBy({
        top: window.innerHeight * 0.1, // Hacer scroll hacia abajo en un 10% de la altura de la ventana
        behavior: "smooth", // Scroll suavizado
      });

      // Restablecer el zoom al nivel inicial
      document.body.style.zoom = initialZoomLevel;

      // Desenfocar el input para ocultar el teclado virtual
      event.target.blur();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder=""
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      {searchTerm.length <= 0 ? (
        <button className="buttonSearch" onClick={handlePress}>
          🔎
        </button>
      ) : (
        <button className="buttonSearch" onClick={handlePress}>
          X
        </button>
      )}
    </div>
  );
};

export default SearchProducts;
