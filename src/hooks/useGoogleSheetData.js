import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";

const useGoogleSheetData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const obtenerURLThumbnailDesdeURL = (url) => {
    const expresionRegular = /\/d\/([a-zA-Z0-9_-]+)\/view/i;
    const coincidencias = url.match(expresionRegular);

    if (coincidencias && coincidencias.length >= 2) {
      const id = coincidencias[1];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;
    } else {
      return "No se encontró ningún ID en la URL proporcionada.";
    }
  };

  useEffect(() => {
    //setProducts(JSON.parse(cachedProducts));
    // setLoading(false);

    const fetchData = async () => {
      const spreadsheetId = config.spreadsheetId;
      const sheetName = config.sheetName;
      const apiKey = config.apiKey;
      const baseurl = config.baseUrl_google;
      const url = `${baseurl}${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

      console.log(url);

      try {
        // Verificar si ya ha pasado suficiente tiempo desde la última llamada a la API
        const lastApiCallTime = localStorage.getItem("lastApiCallTime");
        const inMs = 0;
        const currentTime = new Date().getTime();
        if (lastApiCallTime && currentTime - lastApiCallTime < inMs) {
          console.log("Aún no ha pasado suficiente tiempo desde la última llamada.");
          setLoading(false);
          setErrorMessage(
            "Saca el dedo del f5 apuradx :), ahora a esperar a casa unos segundos ⌛"
          );
          setErrorDialogOpen(true);

          return;
        }

        const response = await axios.get(url);
        const arr = response.data.values;

        const jsonData = arr
          .slice(1)
          .map((row) => {
            const imageUrl = row[6];
            const thumbnailUrl = imageUrl ? obtenerURLThumbnailDesdeURL(imageUrl) : null;

            const name = row[0] || "";
            const price = row[1] || "";
            const originalPrice = row[2] || "";
            const state = row[3] || "";
            const details = row[4] || "";
            const category = row[5] || "";

            const isValid = name && price && originalPrice; // Check básico de validez

            if (!isValid) {
              console.warn(
                `El producto ${name || "sin nombre"} no tiene campos válidos y se omitió.`
              );
              return null; // Omitir el producto si falta algún campo requerido
            }

            return {
              name,
              price,
              originalPrice,
              state,
              details,
              category,
              imageUrl: thumbnailUrl,
            };
          })
          .filter((product) => product !== null); // Filtrar productos nulos

        setProducts(jsonData);
        setLoading(false);
        localStorage.setItem("lastApiCallTime", currentTime);
      } catch (error) {
        setErrorMessage(
          "Hubo un error al cargar los datos. Por favor, inténtalo de nuevo más tarde."
        );
        setErrorDialogOpen(true);

        console.error("Error al leer los datos de la hoja:", error);
      }
    };

    fetchData();
  }, []);

  return { products, loading, errorDialogOpen, setErrorDialogOpen, errorMessage };
};

export default useGoogleSheetData;
