var models = require('../models/models.js');

//objeto estadísticas
var statistics = {quizes:0, comments:0, quizesWithComments:0};
var errors = [];

//function calculate
exports.calculate = function(req, res, next) {
  models.Quiz.count()
  .then(function(nQuizes) {
    statistics.quizes = nQuizes;
    return models.Comment.count();
  })
  .then(function(nComments) {
    statistics.comments = nComments;
    return models.Comment.countCommentedQuizes();
  })
  .then(function(withComments) {
    statistics.quizesWithComments = withComments;
  })
  .catch(function(err) {
    errors.push(err);
  })
  .finally(function() {
    next();
  })
};

//mostrar estadisticas
exports.show = function(req, res) {
  res.render('statistics/show', {statistics: statistics, errors: errors});
};
