function authNotProftMiddleware(req, res, next) {
  if (
    req.session.profFound == undefined &&
    req.session.userRole != "Profesional"
  ) {
    next();
  } else {
    res.redirect("/");
  }
}

module.exports = authNotProftMiddleware;
