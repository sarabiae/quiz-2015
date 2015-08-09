var models = require('../models/models.js');

//GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments
exports.create = function(req, res) {
  var comment = models.Comment.build(
    {texto: req.body.comment.texto, quizId: req.params.quizId}
  );

  var errors = comment.validate();
  if (errors) {
    var i = 0;
    var errores = new Array();
    for (var desc in errors)
      errores[i++] = {message: errors[desc]};
    res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: errores});
  } else {
    comment
    .save()
    .then( function(){ res.redirect('/quizes/'+req.params.quizId) } )
      //res.redirect: redirección HTTP a lista de preguntas
  }
};
