//solo Accesible al propietario del perfil

function authPrivateProfMiddleware(req, res, next) {
  console.log("fuera del if, el req.params.cuit tiene " + req.params.cuit);

  if (req.params.cuit == req.session.profFound.cuit) {
    console.log("dentro del if, el req.params.cuit tiene " + req.params.cuit);
    next();
  } else {
    res.redirect("/");
  }
}

module.exports = authPrivateProfMiddleware;
