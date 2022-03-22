//solo Accesible al propietario del perfil

function authPrivateClientMiddleware(req, res, next) {
  if (req.params.dni == req.session.clientFound.dni) {
    //console.log(req.params.dni);
    next();
  } else {
    res.redirect("/");
  }
}

module.exports = authPrivateClientMiddleware;
