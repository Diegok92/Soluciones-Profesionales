const express = require("express");

const route = express.Router();

const mainController = require("../controllers/main-controller.js");
const loginValidator = require("../validations/loginValidator.js");
const authLoggedtMiddleware = require("../middlewares/authLoggedMiddleware");

route.get("/", mainController.home);
route.get("/productCart", authLoggedtMiddleware, mainController.productCart);
route.get("/login", mainController.login);
route.post("/login", loginValidator, mainController.verificator);
route.get("/signout", mainController.signout);
route.get("/search?", mainController.search);

module.exports = route;
