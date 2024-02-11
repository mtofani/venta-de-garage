import React, { createContext, useEffect, useState, useContext } from "react";
import Papa from "papaparse";
import { BrowserRouter as Router, Route, Routes, json } from "react-router-dom";
import axios from "axios";
import { prettyDOM } from "@testing-library/react";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [data, setData] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const obtenerURLThumbnailDesdeURL = (url) => {
    const expresionRegular = /\/d\/([a-zA-Z0-9_-]+)\/view/i; // Expresión regular para obtener el ID
    const coincidencias = url.match(expresionRegular); // Buscar coincidencias en la URL

    if (coincidencias && coincidencias.length >= 2) {
      const id = coincidencias[1]; // Obtener el ID capturado entre los grupos de la expresión regular
      // Construir y devolver la URL del thumbnail utilizando el ID
      return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;
    } else {
      return "No se encontró ningún ID en la URL proporcionada.";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ID de la hoja de cálculo y rango de celdas
        const spreadsheetId = "1N2BrXwfYSBBeu-nVNUDDRaaO2VxI0SNqjkILNUP22Fo";
        const sheetName = "prod";

        // URL de la solicitud para leer datos, incluyendo la API key
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=AIzaSyCq13uUwLiRUA9YOA64RL7cVr1yA3VXD38`;

        // Realizar la solicitud GET a la API de Google Sheets
        const response = await axios.get(url);
        console.log("EL RESPONSE:", response.data.values);
        const arr = response.data.values;

        const jsonData = arr.slice(1).reduce((accumulator, row) => {
          const imageUrl = row[6];
          const thumbnailUrl = imageUrl ? obtenerURLThumbnailDesdeURL(imageUrl) : null;

          const name = row[0] || "";
          const price = row[1] || "";

          if (!name || !price) {
            console.warn(
              `El producto ${name || "sin nombre"} no tiene un nombre o precio válido y se omitió.`
            );
            return accumulator; // Omitir el producto si falta el nombre o el precio
          }

          const producto = {
            name: name,
            price: price,
            originalPrice: row[2],
            state: row[3] || "",
            details: row[4] || "",
            category: row[5] || "",
            imageUrl: thumbnailUrl,
          };

          accumulator.push(producto); // Agregar el producto al jsonData
          console.log("ACA VERIFICANDO", producto);

          return accumulator;
        }, []);

        console.log("EL JSON DATA", jsonData);
        //setData(jsonData);
        setProducts(jsonData);
      } catch (error) {
        console.error("Error al leer los datos de la hoja:", error);
      }
    };

    fetchData();
  }, []);
  /*
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
  /*
*/
  const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
    return (
      <div className="categoryFilter">
        <h2>Filtrar por categoría:</h2>
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
        <a href={p.url}>
          {console.log(p.imageUrl)}
          {p.state === "sold" ? (
            <span className="product-span">
              <div className="productheader">
                <div className="sold">Vendido</div>
                <span className="category">{p.category}</span>
              </div>
              <div className="img-wrapper">
                <img className="product-img-filter-sold" src={p.imageUrl} alt="imagefilter" />
              </div>
            </span>
          ) : (
            ""
          )}
          {p.state === "reserved" ? (
            <span className="product-span">
              <div className="productheader">
                <div className="reserved">Reservado</div>
                <span className="category">{p.category}</span>
              </div>

              <div className="img-wrapper">
                <img
                  className="product-img-filter-reserved"
                  src={p.imageUrl}
                  loading="lazy"
                  alt="drive"
                />
              </div>
            </span>
          ) : (
            ""
          )}
          {p.state === "notavailable" ? (
            <span className="product-span">
              <div className="productheader">
                <div className="notavailable">No disponible</div>
                <span className="category">{p.category}</span>
              </div>

              <img
                className="product-img-filter-notavailable"
                src={p.imageUrl}
                loading="lazy"
                alt="drive"
              />
            </span>
          ) : (
            ""
          )}
          {p.state === "available" ? (
            <span className="product-span">
              <div className="productheader">
                <div className="available">Disponible</div>
                <span className="category">{p.category}</span>
              </div>
              <div className="img-wrapper">
                <img className="product-img" src={p.imageUrl} loading="lazy" alt="drive" />
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
            <span className="previousPrice">${formatPrice(p.originalPrice)}</span>
            <span>${formatPrice(p.price)}</span>
          </div>

          {p.state !== "sold" ? (
            <div className="contact">
              <img className="icon" src="./whatsapp-icon.png" alt="WhatsApp Icon" />
              <button className="payment">Comprar</button>
            </div>
          ) : (
            ""
          )}
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

              <div className="avion">✈️</div>
              <h2 className="h2prod">Productos</h2>
              <hr class="progress" />
              <ProductList products={filteredProducts} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
