// const { application } = require("express");
const express = require("express");
const clientsRoute = express.Router();
const multer = require("multer");
const path = require("path");
const authNotClientstMiddleware = require("../middlewares/authNotClientsMiddleware");
const authClientsMiddleware = require("../middlewares/authClientsMiddleware");
const authPrivateClientMiddleware = require("../middlewares/authPrivateClientMiddleware");
const clientDbController = require("../controllers/clients-db-controller");
const registerClientValidator = require("../validations/registerClientValidator");
const editClientValidator = require("../validations/editClientValidator");
const apiUsers = require("../api/apiUsers");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, "../public/images/clients"));
  },
  filename: function (req, file, cb) {
    //cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
    file.filename = req.body.dni; //undefined cuando error back en register y en edicion
    cb(
      null,
      file.filename + "-avatar" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadFile = multer({ storage: storage });

//api de users (la url decide q api mostrar, ej metrics)
clientsRoute.get("/api/users", apiUsers.clientList);

//api de users/id (la url decide q api mostrar, ej metrics)
clientsRoute.get("/api/users/:id", apiUsers.clientDetail);
// ---- Registration forms ----

clientsRoute.get(
  "/registerClients",
  authNotClientstMiddleware,
  clientDbController.registerClient
);
clientsRoute.post(
  "/registerClients",
  uploadFile.single("avatar"),
  registerClientValidator,
  clientDbController.createClient
);

// ---- Profile forms ----

clientsRoute.get(
  "/:dni",
  authPrivateClientMiddleware, //modificar para usar client id y no dni
  clientDbController.clientDetail
); //usar PrivateClient

clientsRoute.get(
  "/:dni/editClient",
  uploadFile.single("avatar"),
  authPrivateClientMiddleware, //modificar para usar client id y no dni
  clientDbController.editClient
); //muestro form de edicion

clientsRoute.put(
  "/:dni",
  uploadFile.single("avatar"),
  editClientValidator,
  clientDbController.updateClient
); //por aca viaja al apretar el boton "edit" del formulario

// clientsRoute.get(
//   "/:dni/deleteClients",
//   authPrivateClientMiddleware,

//   clientsController.showDeleteClients
// ); //muestro form de confirmación de eliminación
// clientsRoute.delete("/:dni", clientsController.deleteClients);

// ---- Delete route ----

clientsRoute.delete("/:dni/deleteClient", clientDbController.delete);

module.exports = clientsRoute;
