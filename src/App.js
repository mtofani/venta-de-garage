import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminProducts } from "./AdminProducts";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    console.log("ACA");
    fetch("data.json")
      .then((response) => response.json())
      .then((productsData) => {
        setProducts(productsData);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []); // E
  /*
  useEffect(() => {
    console.log("ACA");
    // Ruta relativa al archivo CSV en la carpeta public
    const csvFilePath = "/data.csv";

    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setProducts(result.data);
      },
      error: (error) => {
        console.log("PINCHOOIDE", error);
        console.error("Error fetching products:", error);
      },
    });
  }, []);
  */
  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <header>
                Venta de GARAGE 😎✈
                <br />
                Deni y Maxi
              </header>
              <CategoryFilter
                categories={getUniqueCategories(products)}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              <h3 className="subtitle">
                Si te gusta algo escribínos
                <p>
                  Todos los productos se retiran por Parque Patricios (a 2 cuadras de estación
                  Hospitales linea H)
                </p>
                <p>Las entregas se hacen hasta el día: 24/03/2024</p>
                <h2>NO HACEMOS ENVIOS</h2>
              </h3>
              <ProductList products={filteredProducts} />
            </div>
          }
        />
        <Route path="/admin" element={<AdminProducts />} />
        <Route path="/products" element={<AdminProducts />} />
      </Routes>
    </Router>
  );
};

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div>
      <label>Filtrar por categoría:</label>
      <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

const ProductCard = (props) => {
  const p = props.product;
  const formatPrice = (p) =>
    p.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: "0",
    });
  const discount = Math.round(100 - (p.price / p.originalPrice) * 100);

  const goWhatsapp = () =>
    window.open(
      `https://api.whatsapp.com/send?phone=+541141764144&text=Hola Deni! Quiero el producto ${p.name} 😊`,
      "_blank"
    );

  return (
    <div className="product">
      <a href={p.url} target="_blank">
        {p.state === "sold" ? (
          <span className="product-span">
            <div className="productheader">
              <span className="category">{p.category}</span>
              <div className="sold">Vendido</div>
            </div>

            <div className="img-wrapper">
              <img className="product-img-filter-sold" src={p.imageUrl} loading="lazy" />
            </div>
          </span>
        ) : (
          ""
        )}
        {p.state == "reserved" ? (
          <span className="product-span">
            <div className="productheader">
              Reserved
              <span className="category">{p.category}</span>
            </div>
            <div className="reserved">Reservado</div>
            <div className="img-wrapper">
              <img className="product-img-filter-reserved" src={p.imageUrl} loading="lazy" />
            </div>
          </span>
        ) : (
          ""
        )}
        {p.state === "notavailable" ? (
          <span className="product-span">
            <div className="productheader">
              No disponible
              <span className="category">{p.category}</span>
            </div>
            <div className="notavailable">No disponible</div>
            <img className="product-img-filter-notavailable" src={p.imageUrl} loading="lazy" />
          </span>
        ) : (
          ""
        )}
        {p.state === "available" ? (
          <span className="product-span">
            <div className="productheader">
              <span className="category">{p.category}</span>
              Disponible
            </div>
            <div className="img-wrapper">
              <img className="product-img" src={p.imageUrl} loading="lazy" />
            </div>
          </span>
        ) : (
          ""
        )}
      </a>
      <div className="product-details">
        <div className="product-title">
          <h3>{p.name}</h3>
          {discount > 0 && <span className="discount">-{discount}%</span>}
        </div>
        <div className="desctexto">
          <ul>
            {Array.isArray(p.details)
              ? p.details.map((detail, index) => <li key={index}>{detail}</li>)
              : p.details.split(";").map((detail, index) => <li key={index}>{detail}</li>)}
          </ul>
        </div>
      </div>
      <div onClick={goWhatsapp} className="box">
        <div className="price">
          <span>{formatPrice(p.price)}</span>
        </div>

        <div className="contact">
          <img className="icon" src="./whatsapp-icon.png" alt="WhatsApp Icon" />
          <button className="payment">Comprar</button>
        </div>
      </div>
    </div>
  );
};

const ProductList = (props) => {
  return (
    <div className="container">
      {props.products.map((p, i) => (
        <ProductCard key={i} product={p} />
      ))}
    </div>
  );
};

// Función para obtener categorías únicas de la lista de productos
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

export default App;
