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
    contactName,
    indications,
    warningMessage,
    reservationMessage,
  } = config;
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const {
    products,
    loading,
    errorDialogOpen,
    setErrorDialogOpen,
    errorMessage,
    validProductCount,
    productCounts,
  } = useGoogleSheetData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("priority"); // Estado para el orden de los productos
  const [productStateFilter, setProductStateFilter] = useState("all");
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
      ? searchedProducts.filter(
          (p) => productStateFilter.toLowerCase() === "all" || p.state === productStateFilter
        )
      : searchedProducts.filter(
          (p) =>
            p.category === selectedCategory &&
            (productStateFilter.toLowerCase() === "all" || p.state === productStateFilter)
        );

  const goWhatsapp = () =>
    window.open(
      `https://api.whatsapp.com/send?phone=${contactNumber}&text=Hola${contactName}, me gustó algo de la venta de garage 🙏🏻`,
      "_blank"
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

              <div className="subtitlecontainer">
                <p> {subtitleMsg} </p>
                <p>{indications}</p>
                <button className="buttonHey" onClick={goWhatsapp}>
                  <a href={telLink}>{contactNumber}</a>
                  <img
                    className=""
                    style={{ height: 20, width: 20, marginLeft: 5, display: "flex" }}
                    src="/img/whats.png"
                    alt="whats"
                  ></img>
                </button>
                <h2>{warningMessage}</h2>
                <h2>{reservationMessage}</h2>
              </div>

              <div className="avion">✈️</div>

              <div className="productStats">
                <h2 className="h2prod">Products:{validProductCount}</h2>

                <h3 className="h3prod">Available: {productCounts.available} 🛒</h3>
                <h3 className="h3prod">Sold: {productCounts.sold} 🔥</h3>
              </div>
              <div className="filters">
                <CategoryFilter
                  categories={getUniqueCategories(products)}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
                <div className="filterOrder">
                  <span className="spanOrder">Sort by:</span>
                  <select className="selectOrder" value={sortOrder} onChange={handleSortChange}>
                    <option value="priority">Priority</option>
                    <option value="asc">Price Low to high </option>
                    <option value="desc">Price High to low</option>
                  </select>
                </div>
                <StateFilter
                  productStateFilter={productStateFilter}
                  handleProductStateFilter={handleProductStateFilter}
                />
              </div>
              <hr className="progress" />
              <SearchProducts searchTerm={searchTerm} onSearchChange={handleSearchChange} />

              <span className="searchcant">{filteredProducts.length} resultados: </span>

              {loading ? <p>Loading...⌛</p> : <ProductList products={filteredProducts} />}
              {errorDialogOpen ? (
                <ErrorDialog
                  message={errorMessage}
                  open={errorDialogOpen}
                  onClose={() => setErrorDialogOpen(false)}
                />
              ) : null}
              <footer>
                <button
                  style={{ border: "none", padding: 0, backgroundColor: "transparent" }}
                  onClick={() => {
                    window.location.href = "https://www.linkedin.com/in/maximilianotofani/";
                  }}
                >
                  <span className="signature">Handcrafted with passion by MT 2024🔎</span>
                  <span></span>
                </button>
              </footer>
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
