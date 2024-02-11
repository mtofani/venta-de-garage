import React from "react";
import { useSpreadsheet } from "./AdminProducts";

const Products = () => {
  const { data } = useSpreadsheet();

  return (
    <div>
      <h1>My App</h1>
      <h2>Datos de la hoja de Google Sheets:</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            Name: {item.name}, Price: {item.price}, State: {item.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
