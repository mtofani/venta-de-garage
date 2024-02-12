import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CategoryFilter from "./components/CategoryFilter";
import ProductList from "./components/ProductList";
import useGoogleSheetData from "./hooks/useGoogleSheetData";
import SearchProducts from "./components/SearchProducts";
import ErrorDialog from "./components/ErrorDialog";
import config from "./config.json";
import CountDown from "./components/CountDown";

const App = () => {
  //config inicial
  const { welcome, owners, event_name, finishdate } = config;
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { products, loading, errorDialogOpen, setErrorDialogOpen, errorMessage } =
    useGoogleSheetData();
  const [searchTerm, setSearchTerm] = useState(""); // Paso 2: Agregar estado searchTerm y setSearchTerm

  const handleSearchChange = (searchTerm) => {
    // Función para actualizar el estado searchTerm
    setSearchTerm(searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const getUniqueCategories = (products) => {
    const categories = products.reduce((acc, product) => {
      if (!acc.includes(product.category)) {
        acc.push(product.category);
      }
      return acc;
    }, []);

    // Asegurarse de que "Todos" esté presente en la lista de categorías
    if (!categories.includes("Todos")) {
      categories.unshift("Todos");
    }

    return categories;
  };

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const searchedProducts = filteredProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <header>
                {event_name} 😎✈
                <br />
                {owners}
                <CountDown finishDate={finishdate} />
              </header>

              <CategoryFilter
                categories={getUniqueCategories(products)}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              <SearchProducts searchTerm={searchTerm} onSearchChange={handleSearchChange} />
              <div className="subtitlecontainer">
                <p> {welcome} </p>
                <h2>NO HACEMOS ENVIOS</h2>
              </div>

              <div className="avion">✈️</div>
              <h2 className="h2prod">Productos</h2>
              <hr className="progress" />
              {loading ? (
                <p>Cargando...⌛</p>
              ) : (
                <ProductList products={searchedProducts || filteredProducts} />
              )}
              {errorDialogOpen ? (
                <ErrorDialog
                  message={errorMessage}
                  open={errorDialogOpen}
                  onClose={() => setErrorDialogOpen(false)}
                />
              ) : null}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
