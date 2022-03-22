function loginStatusMiddleware(req, res, next) {
  res.locals.logged = false;
  if (
    req.session.clientFound !== undefined ||
    req.session.profFound !== undefined
  ) {
    res.locals.logged = true;
    next();
  }
  next();
}

module.exports = loginStatusMiddleware;
