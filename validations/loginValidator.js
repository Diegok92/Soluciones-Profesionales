const { body } = require("express-validator");
const db = require("../database/models");
const bcrypt = require("bcryptjs");

let userLogging;
const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Completar email")
    .bail()
    .custom(async (emailGiven) => {
      const existingEmail = await db.Client.findOne({
        where: {
          email: emailGiven,
        },
      });
      userLogging = existingEmail; 
      if (!existingEmail) {
        throw new Error("Ese email no se encuentra en nuestros registros");
      }
    })
    .bail(),
  body("password")
    .notEmpty()
    .withMessage("Completar contraseña")
    .bail()
    .custom( async (passGiven) => {
      if (userLogging != undefined){
        const passVerif = bcrypt.compareSync(passGiven, userLogging.password);
        if (passVerif == false) {
          throw new Error("Credenciales erróneas - Verifica los datos")
        }
      }
    })
    .bail()
];

module.exports = loginValidator;
