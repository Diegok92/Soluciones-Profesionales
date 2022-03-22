// para todos los links del home, nosotros, about, etc
const db = require("../database/models");

const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator"); //trae los datos guardados en "validator"
const bcrypt = require("bcryptjs");

const clientsFilePath = path.join(__dirname, "../database/clients.json"); //traigo la ruta a la base de datos
const clientsFileText = fs.readFileSync(clientsFilePath, "utf-8"); // me traigo los datos de JSON (formato txt)
const clientsList = JSON.parse(clientsFileText); //lo parseo para poder tener el ARRAY DE PRODUCTOS (array de obj)

const professionalsFilePath = path.join(
  __dirname,
  "../database/professionalsList.json"
); //traigo la ruta a la base de datos
const professionalsFileText = fs.readFileSync(professionalsFilePath, "utf-8"); // me traigo los datos de JSON (formato txt)
const professionalsList = JSON.parse(professionalsFileText); //lo parseo para poder tener el ARRAY DE PRODUCTOS (array de obj)

const express = require("express"); //porq no se usa??
const { sequelize } = require("../database/models"); //porq no se usa??

const Op = db.Sequelize.Op;
const profRoute = require("../routes/professionals-routers");

module.exports = {
  home: (req, res) => {
    db.Profession.findAll()
      .then(function (response) {
        return response;
      })
      .then(function (professions) {
        if (
          req.session.profFound != undefined &&
          req.session.clientFound != undefined &&
          req.session.userRole != undefined
        ) {
          let userProf = req.session.profFound;
          let userClient = req.session.clientFound;
          let userRole = req.session.userRole;

          res.render("index", {
            userClient: userClient,
            userProf: userProf,
            professions: professions,
            userRole,
          });
          switch (userRole) {
            case "Client":
              res.render("index", {
                professions: professions,
                userRole: userRole,
              });
              break;
            case "Professional":
              res.render("index", {
                professions: professions,
                userRole: userRole,
              });
              break;
            default:
              console.log("No es Cliente ni Prof");
              res.render("index", {
                professions: professions,
              });
          }
        }

        if (req.session.profFound != undefined) {
          let userProf = req.session.profFound;
          res.render("index", { userProf: userProf, professions: professions });
        } else if (req.session.clientFound != undefined) {
          let userClient = req.session.clientFound;
          res.render("index", {
            userClient: userClient,
            professions: professions,
          });
        } else {
          res.render("index", { professions: professions });
        }
      });
  },
  productCart: (req, res) => {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;

    res.render("productCart", { userClient: userClient, userProf: userProf });
  },

  login: (req, res) => {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let userRole = req.session.userRole;

    res.render("login", {
      userClient: userClient,
      userProf: userProf,
      userRole: userRole,
    });
  },

  verificator: (req, res) => {
    //verificamos si hay errores en el formulario LOGIN
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //si hay errores
      //console.log(errors);
      res.render("login", { errors: errors.errors, old: req.body });
    } else {
      //si no hay errores:
      //aca verificar q las pass coincidan
      const user = req.body.email;
      let clientFound;
      let profFound;
      let admin;
      let userFound;
      //console.log(errors);
      //Busqueda en Listado Clientes
      db.Client.findOne({
        where: {
          email: req.body.email,
        },
      }).then((result) => {
        userFound = result;
        //console.log(userFound);

        if (userFound == undefined) {
          return res.render("login", {
            errors: [{ msg: "email - Credenciales Invalidas" }],
            old: req.body,
          });
          //return res.redirect("/");
        } else if (userFound != undefined) {
          if (
            bcrypt.compareSync(req.body.password, userFound.password) == true
          ) {
            if (userFound.role == "Client") {
              req.session.clientFound = userFound;
              clientFound = userFound;
              req.session.userRole = "Client";
            } else if (userFound.role == "Professional") {
              req.session.profFound = userFound;
              profFound = userFound;
              req.session.userRole = "Professional";
            } else if (userFound.role == "Admin") {
              req.session.admin = userFound;
              admin = userFound;
              req.session.userRole = "Admin";
            }
          } else {
            return res.render("login", {
              errors: [{ msg: "pass - Credenciales Invalidas" }],
              old: req.body,
            });
          }
        }
        return res.redirect("/");
      });
    }
  },

  signout: (req, res) => {
    req.session.destroy();

    res.redirect("/");
  },

  search: async function (req, res) {
    let searched = req.query.searchedItem;

    //console.log(searched);

    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let user = req.session.profFound;
    let profRequested = searched;
    let userRole = req.session.userRole;

    //console.log(profRequested);
    //console.log(Professional);
    const dayShifts = await db.ProfessionalWorkDayShift.findAll({
      include: [{ association: "workDays" }, { association: "shifts" }],
    });

    db.Professional.findAll({
      include: [
        { association: "clients" },
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
      ],
      where: {
        [Op.or]: [
          {
            "$professions.profession$": {
              [Op.like]: "%" + profRequested + "%",
              // `%${profRequested}%`
            },
          },
          {
            "$clients.firstName$": {
              [Op.like]: "%" + profRequested + "%",
              // `%${profRequested}%`
            },
          },
          {
            "$clients.lastName$": {
              [Op.like]: "%" + profRequested + "%",
              // `%${profRequested}%`
            },
          },
          {
            "$workZones.location$": {
              [Op.like]: "%" + profRequested + "%",
              // `%${profRequested}%`
            },
          },
        ],
      },
    }).then(function (professionals) {
      //console.log("professionals tiene:" + professionals);
      const availability = professionals.map(function (element) {
        const day = dayShifts.filter(function (ele) {
          return ele.professional_id == element.id;
        });
        return {
          workDays: day.map(function (elements) {
            return {
              day: elements.workDays.day,
              shift: elements.shifts.shift,
            };
          }),
        };
      });
      if (professionals == "") {
        profRequested = "Estos no son los resultados que estas buscando";
        //console.log("professionals = []");
      }
      console.log("ProfRequested tiene: " + profRequested);
      res.render("professionals/profPerProfession", {
        professionals: professionals,
        profRequested,
        user: user,
        userClient: userClient,
        userProf: userProf,
        userRole: userRole,
        availability: availability,
      });
    });

    // res.redirect(searched);
  },

  //Busqueda Vieja (en JSON)
  // for (let i = 0; i < clientsList.length; i++) {
  //   if (clientsList[i].email == user) {
  //     clientFound = clientsList[i];
  //     if (
  //       bcrypt.compareSync(req.body.password, clientFound.password) == true
  //     ) {
  //       req.session.clientFound = clientFound; //obj del cliente logueado
  //     } else {
  //       res.render("login", {
  //         errors: [{ msg: "Credenciales Invalidas" }],
  //         old: req.body,
  //       });
  //     }}
  // }
  // for (let i = 0; i < professionalsList.length; i++) {
  //   if (professionalsList[i].email == user) {
  //     profFound = professionalsList[i];
  //     if (
  //       bcrypt.compareSync(req.body.password, profFound.password) == true
  //     ) {
  //       req.session.profFound = profFound; //obj del prof logueado
  //     } else {
  //       res.render("login", {
  //         errors: [{ msg: "Credenciales Invalidas" }],
  //         old: req.body,
  //       });
  //     }
  //   }
};
