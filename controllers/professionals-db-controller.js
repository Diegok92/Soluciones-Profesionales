const express = require("express"); //porq no se usa??
const { sequelize } = require("../database/models"); //porq no se usa??
const db = require("../database/models");
const Op = db.Sequelize.Op;
const profRoute = require("../routes/professionals-routers");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const professionalDBController = {
  //cambiar nombre en enroutador, anterior 'rubros'

  //GET del registerProf, muestra el form
  registerProf: function (req, res) {
    db.Professional.findAll({
      include: [
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" }, //asociacion, no tabla
      ],
    }).then(function (profData) {
      let userProf = req.session.profFound;
      let userClient = req.session.clientFound;
      let userRole = req.session.userRole;

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
      //console.log(uniqueWorkZonesId);

      res.render("professionals/registerProf", {
        userClient: userClient,
        userProf: userProf,
        uniqueProfession: uniqueProfession,
        uniqueProfessionId: uniqueProfessionId,
        uniqueWorkZones: uniqueWorkZones,
        uniqueWorkZonesId: uniqueWorkZonesId,
        userRole: userRole,
      });
    });
  },

  //boton de crear en vista registerProf (POST)
  createProf: async function (req, res) {
    const dniCreadoPrevio = await req.session.dniFound!=undefined ? req.session.dniFound : req.session.clientFound.dni ;

    const profData = await db.Professional.findAll({
      include: [
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" }, //asociacion, no tabla
      ],
    });

    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let userRole = req.session.userRole;

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
    //console.log(uniqueWorkZonesId);

    let errors = validationResult(req);
    //console.log("el body tiene " + req.body);
    if (!errors.isEmpty()) {
      //console.log(errors);
      //si hay errores
      //console.log(errors);

      return res.render("professionals/registerProf", {
        errors: errors.array(),
        old: req.body,
        uniqueProfession: uniqueProfession,
        uniqueProfessionId: uniqueProfessionId,
        uniqueWorkZones: uniqueWorkZones,
        uniqueWorkZonesId: uniqueWorkZonesId,
      });
    }

    const clientDataFound = await db.Client.findOne({
      where: {
        dni: dniCreadoPrevio,
      },
    });
    const clientFound = await clientDataFound.id;

    await db.Client.update(
      {
        role: "Professional",
      },
      { where: { dni: dniCreadoPrevio } }
    );

    const createWorkimage = await db.WorkImage.create({
      imageTitle: req.file.filename,
    });

    const prof = await db.Professional.create({
      emergency: req.body.emergency,
      whyMe: req.body.whyMe,
      price: req.body.price,
      cbu: req.body.cbu,
      licence: req.body.licence,
      client_id: clientFound,
      workZone_id: req.body.workZone,

      workImage_id: createWorkimage.id,
    });

    await prof.setProfessions(req.body.professionId);

    //pendiente de automatizar los dias/turnos (1=mañana )

    let dayShift = req.body.dayShift; //["1,1", "1,2", "3,1", "6,1"]
    let shifts = [];
    let days = [];

    if (typeof dayShift != "string") {
      //osea es un Array (cuando se registra con mas de un horario)
      //recorro una sola vez el array y guardo todos los shift y days

      dayShift.forEach((element) => {
        shifts.push(element[2]); //la coma es el 1
        days.push(element[0]);
      });

      for (let i = 0; i < dayShift.length; i++) {
        await prof.createProfessionalWorkDayShift({
          shift_id: shifts[i], //1=mañana // [1,2,1,1]
          workDay_id: days[i], //2 = martes // [1,1,3,6]
        });
      }
    } else {
      let days = dayShift[0];
      let shifts = dayShift[2];

      await prof.createProfessionalWorkDayShift({
        shift_id: shifts, //1=mañana // [1,2,1,1]
        workDay_id: days, //2 = martes // [1,1,3,6]
      });
      //days.push(dayShift.charAt(0));
      //shifts.push(dayShift.charAt(2));
    }

    req.session.userRole = "Professional";

    res.redirect("/login");
  },

  // Edit -- Falta que traiga los shifts y days (dayShift)
  editProf: function (req, res) {
    //(GET) Muestra Form

    db.Professional.findAll({
      include: [
        { association: "clients" },
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
      ],
    }).then(function (profData) {
      let userProf = req.session.profFound;
      let userClient = req.session.clientFound;
      const uniqueProfession = [];
      const uniqueProfessionId = [];
      const uniqueWorkZones = [];
      const uniqueWorkZonesId = [];
      let profFound = 0;
      let userRole = req.session.userRole;

      // A CAMBIAR! recorrer tabla professions y traer los datos para mostrar en el desplegable
      for (let i = 0; i < profData.length; i++) {
        if (!uniqueProfession.includes(profData[i].professions[0].profession)) {
          uniqueProfession.push(profData[i].professions[0].profession);
          uniqueProfessionId.push(profData[i].professions[0].id);
        }
        if (!uniqueWorkZones.includes(profData[i].workZones.location)) {
          uniqueWorkZones.push(profData[i].workZones.location); //workZones es el nombre de la "Association" //
          uniqueWorkZonesId.push(profData[i].workZones.id);
        }
        if (profData[i].client_id == userProf.id) {
          profFound = profData[i];
        }
      }

      // let workDays = [];
      // let workShifts = [];
      // for (let i = 0; i < profFound.ProfessionalWorkDayShift.length; i++) {
      //   workDays.push(profFound.ProfessionalWorkDayShift[i].workDay_id)
      //   workShifts.push(profFound.ProfessionalWorkDayShift[i].shift_id)
      // }

      // console.log('####################################');

      //console.log("dentro de shift viene " + profFound.shifts[0].shift); //sin el [0] FUNCION NATIVA???
      //console.log("dentro del workDays viene " + profFound.workDays[0].day);

      res.render("professionals/editProf", {
        userClient: userClient,
        userProf: userProf,
        profFound: profFound,
        uniqueProfession: uniqueProfession,
        uniqueProfessionId: uniqueProfessionId,
        uniqueWorkZones: uniqueWorkZones,
        uniqueWorkZonesId: uniqueWorkZonesId,
        userRole: userRole,
        // workDays: workDays,
        // workShifts: workShifts
      });
    });
  },

  updateProf: async function (req, res) {
    const profData = await db.Professional.findAll({
      include: [
        { association: "clients" },
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
      ],
    });

    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    const uniqueProfession = [];
    const uniqueProfessionId = [];
    const uniqueWorkZones = [];
    const uniqueWorkZonesId = [];
    let profFound = 0;
    let userRole = req.session.userRole;

    // A CAMBIAR! recorrer tabla professions y traer los datos para mostrar en el desplegable

    for (let i = 0; i < profData.length; i++) {
      if (!uniqueProfession.includes(profData[i].professions[0].profession)) {
        uniqueProfession.push(profData[i].professions[0].profession);
        uniqueProfessionId.push(profData[i].professions[0].id);
      }
      if (!uniqueWorkZones.includes(profData[i].workZones.location)) {
        uniqueWorkZones.push(profData[i].workZones.location); //workZones es el nombre de la "Association" //
        uniqueWorkZonesId.push(profData[i].workZones.id);
      }
      if (profData[i].client_id == userProf.id) {
        profFound = profData[i];
      }
    }

    let errors = validationResult(req);
    //console.log("el body tiene " + req.body);
    if (!errors.isEmpty()) {
      //console.log(errors);
      //si hay errores
      //console.log(errors);

      return res.render("professionals/editProf", {
        errors: errors.array(),
        userClient: userClient,
        userProf: userProf,
        profFound: profFound,
        uniqueProfession: uniqueProfession,
        uniqueProfessionId: uniqueProfessionId,
        uniqueWorkZones: uniqueWorkZones,
        uniqueWorkZonesId: uniqueWorkZonesId,
        userRole: userRole,
      });
    }

    const idEditar = req.session.profFound.id; //trae el client_id del prof

    // const clientDataFound = await db.Client.findOne({
    //   where: {
    //     dni: idEditar,
    //   },
    // });
    //const clientFound = await clientDataFound.id;

    let createWorkimage = undefined;

    if (req.file != undefined) {
      createWorkimage = await db.WorkImage.create({
        imageTitle: req.file.filename,
      });
    }

    const professional = await db.Professional.findOne({
      where: { client_id: idEditar },
    });

    console.log(req.file);
    console.log(createWorkimage);

    //   const  licenceValue = 0;

    //   if(req.body.haveLicence == "undefined"){ return licenceValue = ""  } else { return  licenceValue = req.body.licence};

    if (createWorkimage) {
      await professional.update({
        emergency: req.body.emergency,
        whyMe: req.body.whyMe,
        price: req.body.price,
        cbu: req.body.cbu,
        licence: req.body.licence,
        workZone_id: req.body.workZone,
        workImage_id: createWorkimage.id,
      });
    } else {
      await professional.update({
        emergency: req.body.emergency,
        whyMe: req.body.whyMe,
        price: req.body.price,
        cbu: req.body.cbu,
        licence: req.body.licence,
        workZone_id: req.body.workZone,
        // workImage_id: createWorkimage.id,
      });
    }

    //falta professions, dayshift, create image

    //await console.log("segundo professional" + )

    if (req.body.email == "") {
      await db.Client.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          mobile: req.body.mobile,
          city_Id: req.body.city_Id,
          //avatar: req.file.filename
        },
        { where: { id: idEditar } }
      );
    } else {
      await db.Client.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          address: req.body.address,
          mobile: req.body.mobile,
          city_Id: req.body.city_Id,
          //avatar: req.file.filename
        },
        { where: { id: idEditar } }
      );
    }

    await professional.setProfessions(req.body.professionId);

    //await console.log(professional)
    //await professional.setWorkImages(req.file.filename)

    //await prof.setProfessions(req.body.professionId);

    await db.ProfessionalWorkDayShift.destroy({
      where: {
        professional_Id: professional.id,
      },
    });

    let dayShift = req.body.dayShift; //["1,1", "1,2", "3,1", "6,1"]
    let shifts = [];
    let days = [];

    if (typeof dayShift != "string") {
      //osea es un Array (cuando se registra con mas de un horario)
      //recorro una sola vez el array y guardo todos los shift y days

      dayShift.forEach((element) => {
        shifts.push(element[2]); //la coma es el 1
        days.push(element[0]);
      });

      for (let i = 0; i < dayShift.length; i++) {
        await professional.createProfessionalWorkDayShift({
          shift_id: shifts[i], //1=mañana // [1,2,1,1]
          workDay_id: days[i], //2 = martes // [1,1,3,6]
        });
      }
    } else {
      let days = dayShift[0];
      let shifts = dayShift[2];

      await professional.createProfessionalWorkDayShift({
        shift_id: shifts, //1=mañana // [1,2,1,1]
        workDay_id: days, //2 = martes // [1,1,3,6]
      });
    }

    // await prof.setShifts(1);
    // await prof.setWorkDays([]); //despues del Set va en mayuscula el alias de la asociacion
    // //hacer for de todos los checkboxes (solo de los nuevos del editform)

    // await prof.createWorkDay({
    //   workDays_id: ,
    //   shift_id:
    // });

    res.redirect("/");
  },

  //API: Listing professions, professionals, professional
  professionsList: function (req, res) {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let user = req.session.profFound;
    let userRole = req.session.userRole;

    db.Profession.findAll().then(function (professions) {
      res.render("rubros", {
        professions: professions,
        user: user,
        userClient: userClient,
        userProf: userProf,
        userRole: userRole,
      });
    });
  },

  profPerProfession: async function (req, res) {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let user = req.session.profFound;
    profRequested = req.params.profession;
    let userRole = req.session.userRole;

    const dayShifts = await db.ProfessionalWorkDayShift.findAll({
      include: [{ association: "workDays" }, { association: "shifts" }],
    });

    //console.log(profRequested);
    //console.log(Professional);
    db.Professional.findAll({
      include: [
        { association: "clients" },
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
      ],
      where: {
        "$professions.profession$": {
          [Op.like]: "%" + profRequested + "%",
          // `%${profRequested}%`
        },
      },
    }).then(function (professionals) {
      //console.log(professionals);

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
  },

  //en la URL viaja el ID en lugar del DNI -- CAMBIAR (para dejarlo igual a client)
  professionalDetail: async function (req, res) {
    let userProf = req.session.profFound;
    let userClient = req.session.clientFound;
    let user = req.session.profFound;
    let userRole = req.session.userRole;

    profRequested = req.params.client_id;

    const dayShifts = await db.ProfessionalWorkDayShift.findAll({
      include: [{ association: "workDays" }, { association: "shifts" }],
    });

    db.Professional.findOne({
      include: [
        { association: "clients" },
        { association: "professions" },
        { association: "workZones" },
        { association: "ProfessionalWorkDayShift" },
        { association: "workImages" },
      ],
      where: { client_id: profRequested },

      //`%${profRequested}%`
    })
      .then(function (professional) {
        const day = dayShifts.filter(function (e) {
          return e.professional_id == professional.id;
        });

        const workDays = day.map(function (elements) {
          return {
            day: elements.workDays.day,
            shift: elements.shifts.shift,
          };
        });
        availability = {
          workDays: workDays,
        };

        //console.log(professional);
        res.render("professionals/professionalDetail", {
          professional: professional,
          user: user,
          userClient: userClient,
          userProf: userProf,
          userRole: userRole,
          availability: availability,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  //Delete
  showDeleteProf: function (req, res) {},

  deleteProf: async (req, res) => {
    const idBorrar = req.session.profFound.id; //client_id

    const idProfDelte = await db.Professional.findOne({
      where: {
        client_id: idBorrar,
      },
    });

    await db.professionals_profession.destroy({
      where: {
        professional_Id: idProfDelte.id,
      },
    });

    await db.ProfessionalWorkDayShift.destroy({
      where: {
        professional_Id: idProfDelte.id,
      },
    });

    await db.Professional.destroy({
      where: {
        client_id: idBorrar,
      },
    });

    await db.WorkImage.destroy({
      where: {
        id: idProfDelte.workImage_id, //columna image del prof
      },
    });

    await db.Client.destroy({
      where: {
        id: idBorrar,
      },
    });

    //delete property 'clientFound' of session instead of completely destroying session
    req.session.destroy();

    res.redirect("/");
  },
};

module.exports = professionalDBController;
