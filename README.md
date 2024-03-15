## VDG
El proyecto tiene como objetivo que tengas un medio sencillo y agil para vender tus cosas.
Los features que tiene actualmente son:
- Buscador de productos
- Filtros/Ordenamiento
- Resumen de ventas
- Contacto por whatsapp con articulo de interés.

Hay varios puntos de mejora, como agregar carrito, cantidades, details... 
En fin que espero que cada un@ pueda explotarlo a su necesidad 😎


## Prerequisitos
- Crear hoja en google sheets, siguiendo la referencia de columnas del archivo example.xls
- Habilitar API y obtener el APIKEY =>  ex: [https://www.youtube.com/watch?v=nqlyLZxX0ys](url)
- Si van a usar imagenes locales, crear el directorio /public/img/, no es obligatorio pero me funcionó mejor respecto a los cambios que hacen los storage providers que probé (Dropbox funciona bien) en cuanto al resto hay algunos issues con las APIS y rate limiting que ponen para obtener fotos que pueden ser molestos.

## Stack 
React + CSS

## Utilización
Dado los prereqs.
- Clonar repo, npm install.
- npm start
- Parametrizar el config.json con sus mensajes, datos personales y de contacto.
- Cargar fotos locales o remotas.
- npm run build, y subir el estático al hosting que mas les guste.
- A vender :)

## Live Demo
  https://ventadymtest.netlify.app/

## Capturas

![image](https://github.com/mtofani/garageReact/assets/69044164/9f20496a-0d05-4d45-a981-fddb2ea26a63)


![image](https://github.com/mtofani/garageReact/assets/69044164/a0150ab3-c690-4d6e-a780-cbbea01b1698)

  
