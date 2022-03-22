const { body } = require("express-validator");
const db = require("../database/models");
const { sequelize } = require("../database/models");
const Op = db.Sequelize.Op;
const path = require("path");

const editProfValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("Tu nombre no puede quedar vacío")
    .isLength({ min: 2 })
    .withMessage("Tu nombre debe tener al menos 2 caracteres")
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
    .isLength({ min: 2 })
    .withMessage("Tu Apellido debe tener al menos 2 caracteres")
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
       
        throw new Error("Debes ingresar un Email valido");
       
      }
      const existingEmail = await db.Client.findOne({
        where: {
          email: email,
        },
      });
      if (existingEmail) {
        throw new Error("Ese Email ya fue registrado");
       
      }


      return true;
    })

    .bail(),
  body("mobile")
    .notEmpty()
    .withMessage("Completar Telefono")
    .isNumeric()
    .withMessage("Debes ingresar tu numero de celular sin el 0 y sin el 15")
    .bail(),
  body("city_Id")
    .notEmpty()
    .withMessage("Elegir Ciudad")
    .isNumeric()
    .withMessage("Elegir Ciudad")
    .bail(), //poner como opcion predeterminada "Seleccione" y verficar contra esa
  body("address")
    .notEmpty()
    .withMessage("Tu domicilio no puede quedar vacío")
    .custom(function (name) {
      const reAddress = new RegExp(/[^A-Za-z0-9\s]/);
      if (name.match(reAddress) != null) {
        return false;
      }
      return true;
    })
    .withMessage("Completar direccion: alfanumerico y espacios")
    .bail(),
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
   
  body("cbu")
    .notEmpty()
    .withMessage("Debe completar el CBU")
    .isLength({ min: 22 })
    .withMessage("El numero de CBU debe contener 22 numeros")
    .isNumeric()
    .withMessage("El numero de CBU debe contener solo numeros")
    .bail(),
];

module.exports = editProfValidator;
