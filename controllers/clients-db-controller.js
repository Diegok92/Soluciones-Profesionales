const express = require("express"); //porq no se usa??
const { sequelize } = require("../database/models"); //porq no se usa??
const db = require("../database/models");
const Op = db.Sequelize.Op;
const profRoute = require("../routes/professionals-routers");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator"); //trae los datos guardados en "validator"

/*
  FALTA REVISAR EL UPDATE DE IMAGENES CON MULTER
  CIUDAD DEL CLIENTDETAIL! SOLO TRAE ID DE ZONA NO EL NOMBRE
*/

const clientDbController = {
  //form de creacion cliente (GET)
  registerClient: (req, res) => {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let userRole = req.session.userRole;

    res.render("users/registerClients", {
      userClient: userClient,
      userProf: userProf,
      userRole: userRole,
    });
  },

  createClient: function (req, res) {
    //Boton del form de creacion cliente (POST)
    req.session.dniFound = req.body.dni;

    let errors = validationResult(req);
    //console.log("el body tiene " + req.body);
    if (!errors.isEmpty()) {
      //borrar la imagen creada ern nuestro carpeta (si es q hay)

      return res.render("users/registerClients", {
        errors: errors.array(),
        old: req.body,
      });
    }

    db.Client.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      dni: req.body.dni,
      mobile: req.body.mobile,
      avatar: req.file.filename,
      password: bcrypt.hashSync(req.body.password, 10),
      city_Id: req.body.city_Id, //viene num por form (futuro, API)
      role: "Client", //req.body.role,
    });

    req.session.userRole = req.body.role;

    if (req.body.role == "Client") {
      console.log("dentro del if para client");
      res.redirect("/login");
    } else if (req.body.role == "Professional") {
      console.log("dentro del if para prof");
      res.redirect("/rubros/registerProf");
    }
  },

  //muestra el id en lugar de la ciudad
  clientDetail: (req, res) => {
    //por (GET)

    db.Client.findOne(
      // {
      //   include: [{ association: "cities" }],
      // },
      {
        include: [{ association: "cities" }],
        where: {
          dni: req.params.dni, //deberia ser el id de la tabla clientes
        },
      }
    ).then(function (result) {
      let userProf = req.session.profFound;
      let userClient = req.session.clientFound;
      let clientFound = result;
      let userRole = req.session.userRole;

      //console.log("Dentro del result viene " + clientFound.email);

      res.render("users/clientDetail", {
        userClient: userClient,
        userProf: userProf,
        clientFound: clientFound,
        userRole,
      }); //render usa ruta en carpeta (users)
    });
  },

  // la vista de edit no trae el value de ciudad

  editClient: (req, res) => {
    // por (GET)

    // db.Professional.findOne({
    //   include: [
    //     { association: "clients" },
    //     { association: "professions" },
    //     { association: "workZones" },
    //     { association: "ProfessionalWorkDayShift" },
    //     { association: "workImages" },
    //   ],
    //   where: { client_id: userClient.id }}
    // ).then(function (result) {
    //   let userProf = req.session.profFound;
    //   let userClient = req.session.clientFound;
    //   let clientFound = result;

    db.Client.findOne({
      where: {
        dni: req.params.dni, //deberia ser el id de la tabla clientes
      },
    }).then(function (result) {
      let userProf = req.session.profFound;
      let userClient = req.session.clientFound;
      let clientFound = result;
      let userRole = req.session.userRole;

      res.render("users/editClient", {
        userClient: userClient,
        userProf: userProf,
        clientFound: clientFound,
        userRole,
      }); //carpeta professionals
    });
  },

  //Actualizar para usar la DB
  //por (PUT)
  updateClient: (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      let userProf = req.session.profFound;
      let userClient = req.session.clientFound;
      let userRole = req.session.userRole;
      return res.render("users/editClient", {
        clientFound: req.session.clientFound,
        errors: errors.array(),
        old: req.body,
        userClient: userClient,
        userProf: userProf,
        userRole: userRole,
      });
    }

    if (req.file != undefined && req.body.email != "") {
      //console.log("IF 1");
      db.Client.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          city_Id: req.body.city_Id, //viene num por form (futuro, API)
          address: req.body.address,
          mobile: req.body.mobile,
          avatar: req.file.filename,
        },
        {
          where: { dni: req.session.clientFound.dni },
        }
      );
    } else if (req.file == undefined && req.body.email != "") {
      // console.log("IF 2 - reqbody avatar" + req.body.avatar);
      db.Client.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          city_Id: req.body.city_Id, //viene num por form (futuro, API)
          address: req.body.address,
          mobile: req.body.mobile,
          //avatar: req.file.filename,
        },
        {
          where: { dni: req.session.clientFound.dni },
        }
      );
    } else if (req.file != undefined && req.body.email == "") {
      // console.log("IF 3");
      db.Client.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          //email: req.body.email,
          city_Id: req.body.city_Id, //viene num por form (futuro, API)
          address: req.body.address,
          mobile: req.body.mobile,
          avatar: req.file.filename,
        },
        {
          where: { dni: req.session.clientFound.dni },
        }
      );
    } else if (req.file == undefined && req.body.email == "") {
      //console.log("IF 4 - req body avatar" + req.body.avatar);
      db.Client.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          // email: req.body.email,
          city_Id: req.body.city_Id, //viene num por form (futuro, API)
          address: req.body.address,
          mobile: req.body.mobile,
          //avatar: req.file.filename,
        },
        {
          where: { dni: req.session.clientFound.dni },
        }
      );
    } else {
      //console.log("NO ENTRO EN NADA Y req avatar: " + req.body.avatar);
      //console.log("NO ENTRO EN NADA Y req email: " + req.body.email);
    }

    res.redirect("/");
    // switch (req.body.avatarFile | req.body.email) {
    //   case req.body.avatarFile != undefined && req.body.email != "":
    //     console.log("entro al email y avatar con algo");
    //     db.Client.update(
    //       {
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         email: req.body.email,
    //         city_Id: req.body.city_Id, //viene num por form (futuro, API)
    //         address: req.body.address,
    //         mobile: req.body.mobile,
    //         avatar: req.file.filename,
    //       },
    //       {
    //         where: { dni: req.session.clientFound.dni },
    //       }
    //     );
    //     break;
    //   case req.body.avatarFile != undefined && req.body.email == "":
    //     console.log("entro al email vacio y avatar con algo");
    //     db.Client.update(
    //       {
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         //email: req.body.email,
    //         city_Id: req.body.city_Id,
    //         address: req.body.address,
    //         mobile: req.body.mobile,
    //         avatar: req.file.filename,
    //       },
    //       {
    //         where: { dni: req.session.clientFound.dni },
    //       }
    //     );
    //     break;
    //   case req.body.avatarFile == undefined && req.body.email != "":
    //     console.log("entro al email con algo y avatar vacios");
    //     db.Client.update(
    //       {
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         email: req.body.email,
    //         city_Id: req.body.city_Id,
    //         address: req.body.address,
    //         mobile: req.body.mobile,
    //         //avatar: req.file.filename,
    //       },
    //       {
    //         where: { dni: req.session.clientFound.dni },
    //       }
    //     );
    //     break;
    //   case req.body.avatarFile == undefined && req.body.email == "":
    //     console.log("entro al email y avatar vacios");
    //     db.Client.update(
    //       {
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         //email: req.body.email,
    //         city_Id: req.body.city_Id,
    //         address: req.body.address,
    //         mobile: req.body.mobile,
    //         //avatar: req.file.filename,
    //       },
    //       {
    //         where: { dni: req.session.clientFound.dni },
    //       }
    //     );
    //     break;
    //   default:
    //     console.log("req avatarFile: " + req.body.avatarFile);
    //     console.log("req email: " + req.body.email);
    // }
    //res.redirect("/");
    //////////////////////////////////////////////////////////////
    // if (req.file.filename) {
    //   db.Client.update(
    //     {
    //       firstName: req.body.firstName,
    //       lastName: req.body.lastName,
    //       //email: req.body.email,
    //       city_Id: req.body.city_Id, //viene num por form (futuro, API)
    //       address: req.body.address,
    //       mobile: req.body.mobile,
    //       avatar: req.file.filename,
    //     },
    //     {
    //       where: { dni: req.session.clientFound.dni },
    //     }
    //   );
    // }
    // if (req.body.email == "") {
    //   db.Client.update(
    //     {
    //       firstName: req.body.firstName,
    //       lastName: req.body.lastName,
    //       city_Id: req.body.city_Id, //viene num por form (futuro, API)
    //       address: req.body.address,
    //       mobile: req.body.mobile,
    //       //avatar: req.file.filename,
    //     },
    //     {
    //       where: { dni: req.session.clientFound.dni },
    //     }
    //   );
    // } else {
    //   db.Client.update(
    //     {
    //       firstName: req.body.firstName,
    //       lastName: req.body.lastName,
    //       email: req.body.email,
    //       city_Id: req.body.city_Id, //viene num por form (futuro, API)
    //       address: req.body.address,
    //       mobile: req.body.mobile,
    //       avatar: req.file.filename,
    //     },
    //     {
    //       where: { dni: req.session.clientFound.dni },
    //     }
    //   );
    // }
  },

  delete: async (req, res) => {
    await db.Client.destroy({
      where: {
        dni: req.params.dni,
      },
    });
    //delete property 'clientFound' of session instead of completely destroying session
    req.session.destroy();

    res.redirect("/");
  },
};

module.exports = clientDbController;
