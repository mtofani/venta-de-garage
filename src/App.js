import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom"; // Importa useNavigate
import CategoryFilter from "./components/CategoryFilter";
import ProductList from "./components/ProductList";
import useGoogleSheetData from "./hooks/useGoogleSheetData";
import SearchProducts from "./components/SearchProducts";
import ErrorDialog from "./components/ErrorDialog";
import config from "./config.json";
import CountDown from "./components/CountDown";
import StateFilter from "./components/StateFilter";
import ProductDetail from "./components/ProductDetail";
const App = () => {
  // Configuración inicial
  const {
    subtitleMsg,
    owners,
    event_name,
    finishdate,
    contactNumber,
    indications,
    warningMessage,
  } = config;
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const {
    products,
    loading,
    errorDialogOpen,
    setErrorDialogOpen,
    errorMessage,
    validProductCount,
  } = useGoogleSheetData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("priority"); // Estado para el orden de los productos
  const [productStateFilter, setProductStateFilter] = useState("available");
  const telLink = "tel:" + contactNumber;
  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (event) => {
    // Obtener el valor seleccionado del menú desplegable
    const selectedValue = event.target.value;

    // Actualizar el estado con el valor seleccionado
    setSortOrder(selectedValue);
  };

  const handleProductStateFilter = (event) => {
    // Cambiar el orden de los productos
    const selectedValue = event.target.value;
    // Actualizar el estado con el valor seleccionado
    setProductStateFilter(selectedValue);
  };

  const getUniqueCategories = (products) => {
    // Función para obtener categorías únicas
    const categories = products.reduce((acc, product) => {
      if (!acc.includes(product.category)) {
        acc.push(product.category);
      }
      return acc;
    }, []);

    if (!categories.includes("Todos")) {
      categories.unshift("Todos");
    }

    return categories;
  };

  const sortedProducts = products.sort((a, b) => {
    // Convertir los precios a números antes de comparar
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);

    if (sortOrder === "asc") {
      return priceA - priceB;
    } else if (sortOrder === "desc") {
      return priceB - priceA;
    } else if (sortOrder === "priority") {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      } else {
        return priceB - priceA;
      }
    }
  });

  const searchedProducts = sortedProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts =
    selectedCategory === "Todos"
      ? searchedProducts.filter((p) => p.state === productStateFilter)
      : searchedProducts.filter(
          (p) => p.category === selectedCategory && p.state === productStateFilter
        );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="container">
              <header>
                <div className="welcomeDiv">
                  {event_name} 😎✈
                  <br></br>
                  {owners}
                </div>
                <CountDown finishDate={finishdate} />
              </header>
              <SearchProducts searchTerm={searchTerm} onSearchChange={handleSearchChange} />

              <div className="subtitlecontainer">
                <p> {subtitleMsg} </p>
                <p>{indications}</p>
                <a href={telLink}>{contactNumber}</a>

                <h2>{warningMessage}</h2>
              </div>
              <div className="avion">✈️</div>

              <div className="filters">
                <CategoryFilter
                  categories={getUniqueCategories(products)}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
                <div className="filterOrder">
                  <span className="spanOrder">Ordenar por:</span>
                  <select className="selectOrder" value={sortOrder} onChange={handleSortChange}>
                    <option value="priority">Destacados</option>
                    <option value="asc">Menor Precio</option>
                    <option value="desc">Mayor Precio</option>
                  </select>
                </div>
                <StateFilter
                  productStateFilter={productStateFilter}
                  handleProductStateFilter={handleProductStateFilter}
                />
              </div>
              <h2 className="h2prod">Productos cargados:{validProductCount}</h2>
              <hr className="progress" />
              {loading ? <p>Cargando...⌛</p> : <ProductList products={filteredProducts} />}
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

        <Route
          path="/producto/:productName"
          element={<ProductDetail products={filteredProducts} />} // Usa el componente ProductDetailPage para esta ruta
        />
      </Routes>
    </Router>
  );
};

export default App;
