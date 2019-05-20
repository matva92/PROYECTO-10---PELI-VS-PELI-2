var express = require('express')
var controlador = require('./controlador')
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express()

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', controlador.obtenerCompetencias)
app.get('/competencias/:id/peliculas/', controlador.obtenerOpciones)
app.post('/competencias/:id/voto', controlador.agregarVoto)
app.get('/competencias/:id/resultados', controlador.obtenerResultados)




var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

