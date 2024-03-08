import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";

const useGoogleSheetData = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validProductCount, setValidProductCount] = useState(0);
  const [productCounts, setProductCounts] = useState({
    sold: 0,
    available: 0,
    // Agrega más estados de productos según sea necesario
  });

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
    const fetchData = async () => {
      const spreadsheetId = config.spreadsheetId;
      const sheetName = config.sheetName;
      const apiKey = config.apiKey;
      const baseurl = config.baseUrl_google;
      const url = `${baseurl}${spreadsheetId}/values/${sheetName}?key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const arr = response.data.values;

        const { soldCount, availableCount, jsonData } = arr.slice(1).reduce(
          (acc, row) => {
            const state = row[3] || "";
            if (state === "sold") {
              acc.soldCount++;
            } else if (state === "available") {
              acc.availableCount++;
            }

            const localImageName = row[6] || "";
            let imageUrl = row[7];
            //COmentado de google thumbnails
            //const thumbnailUrl = imageUrl ? obtenerURLThumbnailDesdeURL(imageUrl) : null;
            const name = row[0] || "";
            const price = row[1] || "";
            const originalPrice = row[2] || "";
            const details = row[4] || "";
            const category = row[5] || "";
            const priority = row[8] || 0; // Se lee el valor de prioridad desde la posición 8

            const isValid = name && price && details; // Check básico de validez

            if (!isValid) {
              console.warn(
                `El producto ${name || "sin nombre"} no tiene campos válidos y se omitió.`
              );
              return acc; // Omitir el producto si falta algún campo requerido
            }
            if (localImageName !== "") imageUrl = localImageName;

            acc.jsonData.push({
              name,
              price,
              originalPrice,
              state,
              details,
              category,
              imageUrl,
              priority,
            });

            return acc;
          },
          { soldCount: 0, availableCount: 0, jsonData: [] }
        );

        setProducts(jsonData);
        setLoading(false);
        setValidProductCount(jsonData.length);
        setProductCounts({ sold: soldCount, available: availableCount });
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

  return {
    products,
    loading,
    errorDialogOpen,
    setErrorDialogOpen,
    errorMessage,
    validProductCount,
    productCounts,
  };
};

export default useGoogleSheetData;
