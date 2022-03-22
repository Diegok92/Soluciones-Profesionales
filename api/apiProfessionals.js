// const fetch = require("node-fetch");
const express = require("express"); //porq no se usa??
const { sequelize } = require("../database/models"); //porq no se usa??
const db = require("../database/models");
const Op = db.Sequelize.Op;
const profRoute = require("../routes/professionals-routers");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator"); //trae los datos guardados en "validator"

const apiProfessional = {
  professionalList: async function (req, res) {
    const profesionales = await db.Professional.findAll({
      include: [
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
        { association: "clients" },
      ],
    });

    const totalProfessionals = profesionales.length;

    const dayShifts = await db.ProfessionalWorkDayShift.findAll({
      include: [{ association: "workDays" }, { association: "shifts" }],
    });

    const professions = await db.Profession.findAll();

    let infoProfession = [];
    let cont = 1;
    for (let i = 0; i < professions.length; i++) {
      let cantPerProf = await db.professionals_profession.count({
        where: {
          profession_id: {
            [Op.like]: cont,
          },
        },
      });

      cont++;

      let professionTitle = await professions[i];

      await infoProfession.push({
        Info: professionTitle,
        total: cantPerProf,
      });
    }

    const listado = await profesionales.map(function (element) {
      const day = dayShifts.filter(function (ele) {
        return ele.professional_id == element.id;
      });
      return {
        id: element.id,
        firstName: element.clients.firstName,
        lastName: element.clients.lastName,
        workDays: day.map(function (elements) {
          return {
            day: elements.workDays.day,
            shift: elements.shifts.shift,
          };
        }),
        workZones: element.workZones.location,
        profession: element.professions[0].profession,
        url: `api/professionals/${element.id}`,
      };
    });

    const data = {
      totalProfessionals: totalProfessionals,
      infoProfession: infoProfession,
      listado: listado,
    };

    return res.status(200).json({
      data,
    });
  },

  professionalDetail: async function (req, res) {
    const profesionales = await db.Professional.findAll({
      include: [
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
        { association: "workImages" },
        { association: "clients" },
      ],
      where: {
        id: req.params.id,
      },
    });

    function emergencia(parametro) {
      if (parametro == 1) {
        return "Yes";
      } else {
        return "No";
      }
    }

    const dayShifts = await db.ProfessionalWorkDayShift.findAll({
      include: [{ association: "workDays" }, { association: "shifts" }],
      where: {
        professional_id: req.params.id,
      },
    });

    //console.log(dayShifts[0].workDays.day)
    //whyMe:element.whyMe,
    //price: element.price,

    const listado = await profesionales.map(function (element) {
      return {
        id: element.id,
        firstName: element.clients.firstName,
        lastName: element.clients.lastName,
        emergency: emergencia(element.emergency),
        price: element.price,
        licence: element.licence,
        workDays: dayShifts.map(function (elements) {
          return {
            day: elements.workDays.day,
            shift: elements.shifts.shift,
          };
        }),
        workZones: element.workZones.location,
        profession: element.professions[0].profession,
        urlWorkImage: `/images/professionals/${element.workImages.imageTitle}`,
      };
    });

    return res.status(200).json({
      
      ProfessionalDetail: listado,
    });
  },
};

module.exports = apiProfessional;
