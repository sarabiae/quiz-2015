var path = require('path');

//Bases de datos POSTGRES y SQLITE
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

var sequelize = new Sequelize(DB_name, user, pwd,{
  dialect: protocol,
  protocol: protocol,
  port: port,
  host: host,
  storage: storage,
  omitNull: true
})

//Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null, {dialect:"sqlite", storage: "quiz.sqlite"});

//Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

//Importar definición de la tabala Comment
var Comment = sequelize.import(path.join(__dirname, 'comment'));
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //Exportar tabala quiz y comment
exports.Comment = Comment;

//sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().success(function(){
  //success(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count) {
    if (count === 0) { //la tabla se inicializa solo si está vacía
      Quiz.create({pregunta:'Capital de Italia', respuesta:'Roma', tema:'ocio'});
      Quiz.create({pregunta:'Capital de Portugal', respuesta:'Lisboa', tema:'ocio'}).then(function() {
        console.log('Base de datos inicializada');
      });
    };
  });
});
