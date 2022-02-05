const express = require("express"); //porq no se usa??
const { sequelize } = require("../database/models"); //porq no se usa??
const db = require("../database/models");
const Op = db.Sequelize.Op;
const profRoute = require("../routes/professionals-routers");
const bcrypt = require("bcryptjs");

const professionalDBController = {
  //cambiar nombre en enroutador, anterior 'rubros'
  //GET del registerProf
  registerProf: function (req, res) {
    db.Professional.findAll({
      include: [{ association: "professions" }, { association: "workZones" }],
    }).then(function (profData) {
      let userProf = req.session.profFound;
      let userClient = req.session.clientFound;
      const uniqueProfession = [];
      const uniqueProfessionId = [];
      const uniqueWorkZones = [];
      const uniqueWorkZonesId = [];
      for (let i = 0; i < profData.length; i++) {
        if (!uniqueProfession.includes(profData[i].professions[0].profession)) {
          uniqueProfession.push(profData[i].professions[0].profession);
          uniqueProfessionId.push(profData[i].professions[0].id);
          //console.log("la profesion es "+ uniqueProfession);
          // console.log("y su id es "+ uniqueProfessionId);

      }
       
      }
      for (let i = 0; i < profData.length; i++) {
        if (!uniqueWorkZones.includes(profData[i].workZones.location)) {
          uniqueWorkZones.push(profData[i].workZones.location); //workZones es el nombre de la "Association" //
          uniqueWorkZonesId.push(profData[i].workZones.id);
          // console.log("la work zone es "+ uniqueWorkZones);
          // console.log("y su id es "+ uniqueWorkZonesId);
        
        } //location es el nombre de la columna de DB
      }
      console.log(uniqueWorkZonesId);
      
      res.render("professionals/registerProf", {
        userClient: userClient,
        userProf: userProf,
        uniqueProfession: uniqueProfession,
        uniqueProfessionId: uniqueProfessionId,
        uniqueWorkZones: uniqueWorkZones,
        uniqueWorkZonesId: uniqueWorkZonesId,
      });
    });
  },

  //boton de crear en vista registerProf
  createProf: function (req, res) {
    let dniCreadoPrevio = req.session.dniFound;
    
    db.Client.findOne({
      where: {
        dni: dniCreadoPrevio,
      },
    })
      .then(function (result) {
        //console.log("result vale " + result);

        let clientFound = result.id;
        return clientFound;
      })
      .then(function (clientId) {
       
        db.Professional.create({
          emergency: req.body.emergency,
          whyMe: req.body.whyMe,
          price: req.body.price,
          cbu: req.body.cbu,
          licence: req.body.licence,
          client_id: clientId,
          workZone_id: req.body.workZone,
          //professsion: professionId
          //workImage_id:
          //shift:
          //workDays:
        }).then(function(data){

       res.redirect("/login")

        })
     
      });

    //meter en prof el client_id
  },

  // Edit
  editProf: function (req, res) {},
  updateProf: function (req, res) {},

  //Listing professions, professionals, professional
  professionsList: function (req, res) {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let user = req.session.profFound;
    db.Profession.findAll().then(function (professions) {
      res.render("rubros", {
        professions: professions,
        user: user,
        userClient: userClient,
        userProf: userProf,
      });
    });
  },

  profPerProfession: function (req, res) {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let user = req.session.profFound;
    profRequested = req.params.profession;
    //
    //console.log(profRequested);
    //console.log(Professional);
    db.Professional.findAll({
      include: [
        { association: "clients" },
        { association: "professions" },
        { association: "workZones" },
        { association: "workDays" },
        { association: "shifts" },
      ],
      where: {
        "$professions.profession$": {
          //magia de pablo...
          [Op.like]: "%" + profRequested + "%",
          // `%${profRequested}%`
        },
      },
    }).then(function (professionals) {
      //console.log(professionals);
      res.render("professionals/profPerProfession", {
        professionals: professionals,
        profRequested,
        user: user,
        userClient: userClient,
        userProf: userProf,
      });
    });
  },
  professionalDetail: function (req, res) {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let user = req.session.profFound;

    profRequested = req.params.client_id;
    db.Professional.findOne({
      include: [
        { association: "clients" },
        { association: "professions" },
        { association: "workZones" },
        { association: "workDays" },
        { association: "shifts" },
      ],
      where: { client_id: profRequested },

      //magia de pablo...

      //`%${profRequested}%`
    })
      .then(function (professional) {
        //console.log(professional);
        res.render("professionals/professionalDetail", {
          professional: professional,
          user: user,
          userClient: userClient,
          userProf: userProf,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  //Delete
  showDeleteProf: function (req, res) {},
  deleteProf: function (req, res) {},
};

module.exports = professionalDBController;
