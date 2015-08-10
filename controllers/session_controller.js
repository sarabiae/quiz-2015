//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

//GET /login -- Formulario Login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

//POST /login -- Crear la sesion
exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    if (error) { //si hay error retornamos mensajes de error de sesción
      req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
      res.redirect("/login");
      return;
    }

    //Crear req.session.user y guardar campos id y username
    //La session se define por la existencia de req.session.user
    req.session.user = {id:user.id, username:user.username};

    //guardar la hora de entrada a la sesión y variable
    req.session.horaEntrada = new Date().getTime();
    req.session.autoLogout = false;

    res.redirect(req.session.redir.toString()); //redirigir a path anterior a login
  });
};

//DELETE /logout -- Destruir sesion
exports.destroy = function(req, res) {
  delete req.session.user;
  if (req.session.autoLogout) {
    res.redirect('/login');
  } else {
    res.redirect(req.session.redir.toString());
  }
};
