import React from "react";
import Product from "./Product";
import { useNavigate } from "react-router-dom";


const ProductList = ({ products }) => {
  
  return (
    <div className="productcontainer">
      {products.length === 0 ? (
        <div className="emptyproducts">
          <p>No hay resultados 🔎, probá con otra combinación</p>
        </div>
      ) : (
        products.map((product, index) => <Product key={index} product={product} />)
      )}
    </div>
  );
};

export default ProductList;
