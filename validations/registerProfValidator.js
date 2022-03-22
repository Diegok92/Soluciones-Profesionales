const { body } = require("express-validator");
const db = require("../database/models");
const { sequelize } = require("../database/models"); //porq no se usa??
const Op = db.Sequelize.Op;
const path = require("path");

const registerProfValidator = [
  body("professionId")
    .notEmpty()
    .withMessage("Debe elegir una Profesión")
    .bail(),
  // body("otherJob")
  // .if(body("otherJob").notEmpty())
  //   .isLength({ min: 2 })
  //   .withMessage("Completa la Profesión(minimo 2 caracteres)")
  //   .isAlpha()
  //   .withMessage("El nombre de la Profesión solo puede tener letras")
  //   .bail(),
  body("licence")
    .if(body("haveLicence").exists())
    .notEmpty()
    .withMessage("Completa la licencia")
    .isString()
    .withMessage("La licencia puede tener numeros y letras")
    .bail(),
  body("workZone")
    .notEmpty()
    .withMessage("Debe elegir una zona de prestación")
    .isNumeric()
    .withMessage("Debe elegir una zona de prestación1")
    .bail(),
  body("emergency")
    .notEmpty()
    .withMessage("Debe completar el campo Atiende Emergencias")
    .bail(),
  body("dayShift")
    .notEmpty()
    .withMessage("Debe completar los Dias de Prestación")
    .bail(),
  body("whyMe")
    .notEmpty()
    .withMessage("Debe completar el campo Razones para elegirme")
    .isString()
    .withMessage("Puede utilizar numero y letras")
    .isLength({ min: 50, max: 500 })
    .withMessage("El mensaje debe contener entre 50 y 500 letras")
    .bail(),
  body("price")
    .notEmpty()
    .withMessage("El precio no puede estar vacio")
    .isNumeric()
    .withMessage("El precio debe ser un numero sin signos")
    .bail(),
  body("workImage")
    .custom((value, { req }) => {
      if (!req.file) throw new Error("Falta Imagen de trabajos realizados");
      return true;
    })
    .custom(function (value, { req }) {
      var extension = path.extname(req.file.originalname).toLowerCase();
      switch (extension) {
        case ".jpg":
          return true;
        case ".jpeg":
          return true;
        case ".png":
          return true;
        case ".gif":
          return true;
        default:
          return false;
      }
    })
    .withMessage("La imagen debe ser: .jpg .jpeg .png o .gif")
    .custom(function (value, { req }) {
      var fileSize = req.file.size;
      var size = Math.round(fileSize / 1024);

      if (size > 1024) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage("La imagen debe pesar menos de 1mb")
    .bail(),

  body("cbu")
    .notEmpty()
    .withMessage("Debe completar el CBU")
    .isLength({ min: 22 })
    .withMessage("El numero de CBU debe contener 22 numeros")
    .isNumeric()
    .withMessage("El numero de CBU debe contener solo numeros")
    .bail(),
];

module.exports = registerProfValidator;
