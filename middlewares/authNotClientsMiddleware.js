function authNotClientstMiddleware(req, res, next) {
  if (
    req.session.clientFound == undefined &&
    req.session.userRole == undefined
  ) {
    next();
  } else if (
    req.session.clientFound !== undefined &&
    req.session.userRole !== 'Professional'
  ) {
    res.redirect("/rubros/registerProf");
  } else {
    res.redirect("/");
  }
}

module.exports = authNotClientstMiddleware;
