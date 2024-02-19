import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductDetail from "./ProductDetail"; // Importa ProductDetail
import config from "../config.json";

const { contactNumber, contactName } = config;

const Product = ({ product }) => {
  const [details, setDetails] = useState("");

  const navigate = useNavigate();

  const handleVerMas = () => {
    setDetails(product.details);

    // Navega a la ruta deseada
    navigate(`/producto/${product.name}`, { state: { product } });
  };
  const formatPrice = (p) => {
    //MUESTRA EN FORMATO PESOS ARGENTINOS  AGREGANDO UN . COMO SEPARADOR DE MILES
    return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  //.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const discount = Math.round(100 - (product.price / product.originalPrice) * 100);

  const goWhatsapp = () =>
    window.open(
      `https://api.whatsapp.com/send?phone=${contactNumber}&text=Hola ${contactName} Quiero el producto ${product.name} 😊`,
      "_blank"
    );

  return (
    <div className="product">
      <a href={product.url}>
        {product.state === "sold" && (
          <span className="product-span">
            <div className="productheader">
              <div className="sold">Vendido</div>
              <span className="category">{product.category}</span>
            </div>
            <div className="img-wrapper">
              <img className="product-img-filter-sold" src={product.imageUrl} alt="imagefilter" />
            </div>
          </span>
        )}
        {product.state === "reserved" && (
          <span className="product-span">
            <div className="productheader">
              <div className="reserved">Reservado</div>
              <span className="category">{product.category}</span>
            </div>

            <div className="img-wrapper">
              <img
                className="product-img-filter-reserved"
                src={product.imageUrl}
                loading="lazy"
                alt="drive"
              />
            </div>
          </span>
        )}
        {product.state === "notavailable" && (
          <span className="product-span">
            <div className="productheader">
              <div className="notavailable">No disponible</div>
              <span className="category">{product.category}</span>
            </div>

            <img
              className="product-img-filter-notavailable"
              src={product.imageUrl}
              loading="lazy"
              alt="drive"
            />
          </span>
        )}
        {product.state === "available" && (
          <span className="product-span">
            <div className="productheader">
              <div className="available">Disponible</div>
              <span className="category">{product.category}</span>
            </div>
            <div className="img-wrapper">
              <img className="product-img" src={product.imageUrl} loading="lazy" alt="drive" />
            </div>
          </span>
        )}
      </a>
      <div className="product-details">
        <div className="product-title">
          <h3>{product.name}</h3>
          {discount > 0 && <span className="discount">-{discount}%</span>}
        </div>
        <div className="desctexto">
          <ul>
            {Array.isArray(product.details)
              ? product.details.map((detail, index) => <p key={index}>{detail}</p>)
              : product.details.split(";").map((detail, index) => (
                  <li key={index} className={detail.length > 60 ? "long-detail" : "short-detail"}>
                    {detail}
                  </li>
                ))}
          </ul>
        </div>
      </div>
      <div className="box">
        <div className="price">
          <span className="previousPrice">${formatPrice(product.originalPrice)}</span>
          <span>${formatPrice(product.price)}</span>
        </div>

        {product.state !== "sold" && (
          <div className="contact">
            <img className="icon" src="./whatsapp-icon.png" alt="WhatsApp Icon" />
            <button onClick={goWhatsapp} className="payment">
              Comprar
            </button>
          </div>
        )}
      </div>
      {/*   <div className="more">
        /*
        <button className="buttonnav" onClick={handleVerMas}>
         + Info
       </button>
        
      </div> */}
    </div>
  );
};

export default Product;
