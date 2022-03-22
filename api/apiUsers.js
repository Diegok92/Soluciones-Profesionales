const express = require("express"); //porq no se usa??
const { sequelize } = require("../database/models"); //porq no se usa??
const db = require("../database/models");
const Op = db.Sequelize.Op;
const profRoute = require("../routes/professionals-routers");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator"); //trae los datos guardados en "validator"

//enviamos de client: Cant Clientes, city_Id, role
//enviamos de profesional:  cant, emergency, price,

const apiUsers = {
  //listado clientes
  clientList: async function (req, res) {
    //

    const cliente = await db.Client.findAll({
      include: [{ association: "cities" }],
    });

    //{id:1,name:pedro,email:pedro.com, detail: "api/user/1"}

    const soloClientes = cliente.filter(function (valor) {
      return valor.role != "Professional";
    });

    const listado = await soloClientes.map(function (element) {
      return {
        id: element.id,
        firstName: element.firstName,
        lastName: element.lastName,
        email: element.email,
        url: `api/users/${element.id}`,
      };
    });
    console.log(listado);
    //cliente.reduce(function () {});

    // roles = cliente.map(function (cliente) {
    //   return cliente.role;
    // });

    const profesionales = await db.Professional.findAll({
      include: [
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
        { association: "clients" },
      ],
    });

    const totalProfessionals = profesionales.length;

    totalClients = cliente.filter(function (cliente) {
      return cliente.role == "Client";
    });

    totalAdmins = cliente.filter(function (admin) {
      return admin.role == "Admin";
    });

    const professions = await db.Profession.findAll();

    const uniqProfessions = professions.filter(function (valor) {
      return valor.profession;
    });

    const professionsName = professions.map(function (x) {
      return x.profession;
    });

    const totalPerProf = [];
    for (let i = 1; i <= uniqProfessions.length; i++) {
      totalPerProf.push(
        await db.professionals_profession.count({
          where: {
            profession_id: {
              [Op.like]: i,
            },
          },
        })
      );
      await db.Profession.findByPk(i);
    }

    //   cantidad = await db.Client.count()

    //   cantidad = await db.Role.findAll({
    //       atributes: ["name"],
    //       group: []
    //   })

    //FALTA filtrar cant por rol

    return res.status(200).json({
      //data: clients,
      totalUsers: totalProfessionals + totalClients.length + totalAdmins.length,
      //profperzone:,
      //totalAdmin:
      totalProfessionals: totalProfessionals,
      totalClients: totalClients.length + totalAdmins.length,
      totalAdmins: totalAdmins.length,
      //professions: professions,
      //totalProfessions: uniqProfessions.length,
      //totalPerProf: totalPerProf,
      listado: listado,
    });
  },
  clientDetail: async function (req, res) {
    const cliente = await db.Client.findAll({
      include: [{ association: "cities" }],
      where: {
        id: req.params.id,
      },
    });

    const listado = await cliente.map(function (element) {
      return {
        id: element.id,
        firstName: element.firstName,
        lastName: element.lastName,
        email: element.email,
        city_Id: element.cities.province,
        mobile: element.mobile,
        role: element.role,
        urlAvatar: `/images/clients/${element.avatar}`,
      };
    });

    return res.status(200).json({
      listado: listado,
    });
  },

  //listado profesionales

  //listado profesiones (analizar si hacer en otra api)
};

module.exports = apiUsers;
