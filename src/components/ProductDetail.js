import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import config from "../config.json";
const { contactnumber } = config;

const ProductDetail = () => {
  const { productName } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // Utiliza useNavigate en lugar de useHistory

  const { product } = location.state;
  const currentURL = encodeURIComponent(window.location.href);

  const goWhatsapp = () => {
    // Construye el mensaje de WhatsApp con el enlace del producto
    const whatsappMessage = `Hola Deni! Quiero el producto ${productName} 😊`;

    // Abre WhatsApp con el mensaje
    window.open(
      `https://api.whatsapp.com/send?phone=${contactnumber}&text=${whatsappMessage}
     `,
      "_blank"
    );
  };

  const goBack = () => {
    navigate(-1); // Vuelve atrás en la historia del navegador
  };
  // Encuentra el producto correspondiente según el ID proporcionado
  //const product = products.find((product) => product.id === productId);

  // Si el producto no se encuentra, muestra un mensaje de error
  // if (!product) {

  // Renderiza los detalles del producto

  return (
    <div className="product-detail">
      <button className="buttonnav" onClick={goBack}>
        {"<--"}
      </button>

      {/* Botón de retroceso */}
      <h2>Detalles del producto: {productName}</h2>
      <p>Precio: {product.price}</p>
      <img className="img-detail" src={product.imageUrl} alt="imagefilter" />
      <p>Detalles: {product.details}</p>
      <div onClick={goWhatsapp} className="boxDetailed">
        <div className="contact">
          <img className="icon" src="../whatsapp-icon.png" alt="WhatsApp Icon" />
          <button className="payment">Comprar</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
