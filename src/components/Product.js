import React from "react";

const Product = ({ product }) => {
  const formatPrice = (p) =>
    p.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: "0",
    });
  const discount = Math.round(100 - (product.price / product.originalPrice) * 100);

  const goWhatsapp = () =>
    window.open(
      `https://api.whatsapp.com/send?phone=+541141764144&text=Hola Deni! Quiero el producto ${product.name} } 😊`,
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
              ? product.details.map((detail, index) => <li key={index}>{detail}</li>)
              : product.details.split(";").map((detail, index) => <li key={index}>{detail}</li>)}
          </ul>
        </div>
      </div>
      <div onClick={goWhatsapp} className="box">
        <div className="price">
          <span className="previousPrice">${formatPrice(product.originalPrice)}</span>
          <span>${formatPrice(product.price)}</span>
        </div>

        {product.state !== "sold" && (
          <div className="contact">
            <img className="icon" src="./whatsapp-icon.png" alt="WhatsApp Icon" />
            <button className="payment">Comprar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
