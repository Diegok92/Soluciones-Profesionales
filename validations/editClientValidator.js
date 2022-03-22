const { body } = require("express-validator");
const db = require("../database/models");
const { sequelize } = require("../database/models"); //porq no se usa??
const Op = db.Sequelize.Op;
const path = require("path");
const express = require("express");

const editClientValidator = [
  /*
modificación de productos
○ Nombre
    ■ Obligatorio.
    ■ Deberá tener al menos 2 caracteres.
○ Descripción
    ■ Deberá tener al menos 20 caracteres.
○ Imagen
    ■ Deberá ser un archivo válido (JPG, JPEG, PNG, GIF).
○ (Opcional) Tablas secundarias
    ■ Verificar que los valores existan en base. Es decir, que los valores
    de talles, colores, etc. que lleguen sean válidos en la base.
*/
  body("firstName")
    .notEmpty()
    .withMessage("Tu nombre no puede quedar vacío")
    .isLength({ min: 2, max: 20 })
    .withMessage("Completar Nombre (Min 2 caracteres, max 20)")
    .custom(function (name) {
      const reName = new RegExp(/[^a-zA-Z]/);
      if (name.match(reName) != null) {
        return false;
      }
      return true;
    })
    .withMessage("1er Nombre, sin espacios")
    .bail(),
  body("lastName")
    .notEmpty()
    .withMessage("Tu apellido es obligatorio!")
    .isLength({ min: 2, max: 20 })
    .withMessage("Completar Apellido (Min 2 caracteres, max 20)")
    .custom(function (name) {
      const reName = new RegExp(/[^a-zA-Z]/);
      if (name.match(reName) != null) {
        return false;
      }
      return true;
    })
    .withMessage("1er Apellido, sin espacios")
    .bail(),
  body("email")
    .custom(async function (email) {
      if (email == "") {
        return true;
      }
      const reEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

      if (email.match(reEmail) == null) {
        //errors.push("Debes ingresar un Email valido");
        throw new Error("Debes ingresar un Email valido");
        //return false;
      }
      const existingEmail = await db.Client.findOne({
        where: {
          email: email,
        },
      });
      if (existingEmail) {
        throw new Error("Ese Email ya fue registrado");
        //return false;
      }

      // if (email == "1234@1234.com") {
      //   //errors.push("Debes ingresar un Email valido");
      //   throw new Error("1234 ya registrado");
      //   //return false;
      // }

      return true;
    })
    //.notEmpty()
    // .withMessage(
    //   "en caso de Modificar tu email guardado, debe no estar ya registrado y ser valido"
    // )
    //.isEmail()
    //.withMessage("Debes ingresar un email válido")
    // .custom(async (emailGiven) => {
    //   const existingEmail = await db.Client.findOne({
    //     where: {
    //       email: emailGiven,
    //     },
    //   });
    //   if (existingEmail) {
    //     throw new Error("Ese Email ya fue registrado");
    //   }
    // })
    .bail(),
  body("mobile")
    .notEmpty()
    .withMessage("Completar Telefono")
    .isLength({ min: 8, max: 20 })
    .withMessage("Telefono debe tener entre 8 y 20 numeros")
    .isNumeric()
    .withMessage("Debes ingresar tu numero de celular sin el 0 y sin el 15")
    .bail(),
  body("city_Id")
    .notEmpty()
    .withMessage("Elegir Ciudad")
    .isNumeric()
    .withMessage("Elegir Ciudad")
    .isLength({ min: 1, max: 4 }) //9999
    .withMessage("Debes elegir una ciudad de las listadas")
    .bail(), //poner como opcion predeterminada "Seleccione" y verficar contra esa
  body("address")
    .notEmpty()
    .withMessage("Tu domicilio no puede quedar vacío")
    .isLength({ min: 2, max: 30 })
    .withMessage("la direccion debe tener entre 2 y 30 caracteres")
    .custom(function (name) {
      const reAddress = new RegExp(/[^A-Za-z0-9\s]/);
      if (name.match(reAddress) != null) {
        return false;
      }
      return true;
    })
    .withMessage("Completar direccion: alfanumerico y espacios")
    .bail(),
  body("avatar")
    .custom(function (value, { req }) {
      if (!req.file) {
        return true;
      } else {
        var extension = path.extname(req.file.originalname).toLowerCase();

        switch (extension) {
          case ".jpg":
          case ".jpeg":
          case ".png":
          case ".gif":
            var fileSize = req.file.size;
            var size = Math.round(fileSize / 1024);

            if (size > 1024) {
              throw new Error("La imagen debe pesar menos de 1mb");
              //return false;
            } else {
              return true;
            }
          default:
            throw new Error("la imagen debe ser: .jpg .jpeg .png o .gif");
          //return false;
        }
      }
    })
    .bail(),
];

module.exports = editClientValidator;
