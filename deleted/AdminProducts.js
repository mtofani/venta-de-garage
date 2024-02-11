import React, { createContext, useEffect, useState, useContext } from "react";

import axios from "axios";
const SpreadsheetContext = createContext();

const AdminProducts = () => {
  const [data, setData] = useState([]);
  const contextValue = {
    data: [],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ID de la hoja de cálculo y rango de celdas
        const spreadsheetId = "1N2BrXwfYSBBeu-nVNUDDRaaO2VxI0SNqjkILNUP22Fo";
        const range = "prod!A1:C4";

        // URL de la solicitud para leer datos, incluyendo la API key
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=AIzaSyCq13uUwLiRUA9YOA64RL7cVr1yA3VXD38`;

        // Realizar la solicitud GET a la API de Google Sheets
        const response = await axios.get(url);
        console.log("EL RESPONSE:", response.data.values);
        const arr = response.data.values;

        const jsonData = arr.slice(1).map((row) => {
          return {
            name: row[0],
            price: row[1],
            state: row[2],
          };
        });

        console.log("EL JSON DATA", jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error al leer los datos de la hoja:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SpreadsheetContext.Provider value={{ data }}>
      <div>
        <h2>Datos de la hoja de Google Sheets:</h2>
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              Name: {item.name}, Price: {item.price}, State: {item.state}
            </li>
          ))}
        </ul>
      </div>
    </SpreadsheetContext.Provider>
  );
};

const useSpreadsheet = () => useContext(SpreadsheetContext);

export { AdminProducts, useSpreadsheet, SpreadsheetContext };
