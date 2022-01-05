// parte en la carpeta views y entra a cada carpeta segun pedido

const { application } = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const professionalsFilePath = path.join(
  __dirname,
  "../database/professionalsList.json"
); //traigo la ruta a la base de datos
const professionalsFileText = fs.readFileSync(professionalsFilePath, "utf-8"); // me traigo los datos de JSON (formato txt)
const professionals = JSON.parse(professionalsFileText); //lo parseo para poder tener el ARRAY DE PRODUCTOS (array de obj)

function saveProf() {
  const profEnTxt = JSON.stringify(professionals); //paso a txt el array p/ luego agregar/modificar la database
  fs.writeFileSync(professionalsFilePath, profEnTxt, "utf-8"); //sobreescribo el JSON
}

//hacemos esto para cuando se registran con una prof != al standard que tenemos
for (let i = 0; i < professionals.length; i++) {
  if (professionals[i].jobTitle == "Otro") {
    professionals[i].jobTitle = professionals[i].otherJob;
  }
}

module.exports = {
  rubros: (req, res) => {
    res.render("rubros");
  },

  professionalDetail: (req, res) => {
    const profObject = professionals.filter(function (prof) {
      return prof.cuit == req.params.cuit;
      //"prof" es c/ pos del array (un obj en particular)
      //filtro el array de obj y devuelvo aquel obj con cuit pasado por url
    });
    res.render("professionals/professionalDetail", { profObject: profObject }); //carpeta professionals
  },

  registerProf: (req, res) => {
    res.render("professionals/registerProf");
  },

  createProf: (req, res) => {
    const newProfessional = {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
      avatar: req.file.filename,
    };

    professionals.push(newProfessional);

    saveProf();

    res.redirect("/");
  },

  editProf: (req, res) => {
    const aEditar = professionals.filter(function (prof) {
      return prof.cuit == req.params.cuit;
    });
    res.render("professionals/editProf", { aEditar: aEditar }); //carpeta professionals
  },

  updateProf: (req, res) => {
    //por aca viaja el boton "confirmar" del form editProf
    const indexProfBuscado = professionals.findIndex(function (prof) {
      return prof.cuit == req.params.cuit;
    });

    const updateProf = {
      ...req.body,
    };

    professionals[indexProfBuscado] = updateProf; //reemplazo el actualizado en el listado original

    saveProf();

    const profession = req.params.jobTitle;
    const cuit = req.params.cuit;
    res.redirect("/rubros");
  },

  showDeleteProf: (req, res) => {
    const toDelete = professionals.filter((prof) => {
      return prof.cuit == req.params.cuit;
    });
    res.render("professionals/deleteProf", { toDelete: toDelete });
  },

  deleteProf: (req, res) => {
    let profToDelete = professionals.findIndex(
      (prof) => prof.cuit == req.params.cuit
    );
    professionals.splice(profToDelete, 1);
    saveProf();
    res.redirect("/rubros");
  },

  profPerRubro: (req, res) => {
    const rubro = professionals.filter(function (prof) {
      return prof.jobTitle == req.params.rubro;
    });
    res.render("professionals/profPerRubro", { rubro: rubro });
    //uso el req.params para filtrar por rubro
  },
};
