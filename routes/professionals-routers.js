// const { application } = require("express");
const express = require("express");
const multer = require("multer");
const path = require("path");
const authLoggedtMiddleware = require("../middlewares/authLoggedMiddleware");
const authNotProftMiddleware = require("../middlewares/authNotProfMiddleware");
const authPrivateProfMiddleware = require("../middlewares/authPrivateProfMiddleware");
const registerProfValidator = require("../validations/registerProfValidator");
const editProfValidator = require("../validations/editProfValidator");
const apiProfessionals = require("../api/apiProfessionals");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.join(__dirname, "../public/images/professionals"));
  },
  filename: function (req, file, cb) {
    //cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
    file.filename = req.body.cbu;
    cb(
      null,
      file.filename +
        "-wImg" +
        Date.now() +
        path.extname(file.originalname) //lograr q diga "dni-avatar"
    );
  },
});

const uploadFile = multer({ storage: storage });

const profRoute = express.Router();
const professionalDBController = require("../controllers/professionals-db-controller.js");
//const profController = require("../controllers/professionals-controller.js");

//aca hicimos los cambios
//profRoute.get("/", profController.rubros);
profRoute.get("/", professionalDBController.professionsList);

profRoute.get("/api/professionals", apiProfessionals.professionalList);

profRoute.get("/api/professionals/:id", apiProfessionals.professionalDetail);

profRoute.get(
  "/:profession/:client_id",
  authLoggedtMiddleware,
  professionalDBController.professionalDetail
);

profRoute.get(
  "/registerProf",
  authNotProftMiddleware,
  professionalDBController.registerProf
);
profRoute.post(
  "/registerProf",
  uploadFile.single("workImages"),
  registerProfValidator, //verificar
  professionalDBController.createProf
);

profRoute.get(
  "/:rubro/:id/editProf",
  authPrivateProfMiddleware,
  professionalDBController.editProf
); //muestro form de edicion

profRoute.put(
  "/:idProf",
  uploadFile.single("workImages"),
  //uploadFile.single("avatar"),
  editProfValidator,
  professionalDBController.updateProf
);
//Boton confirm del form de edicion

// profRoute.get(
//   "/:rubro/:cuit/deleteProf",
//   authPrivateProfMiddleware,
//   uploadFile.single("workImages"), //verificar
//   profController.showDeleteProf
// ); //muestro form de confirmación de eliminación

profRoute.delete(
  "/:rubro/:idProf/deleteProf",
  professionalDBController.deleteProf
);
///rubros/Pileteria/243/delete

//profRoute.get("/:rubro", profController.profPerRubro);
profRoute.get("/:profession", professionalDBController.profPerProfession);
module.exports = profRoute;
