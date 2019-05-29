var express = require('express')
var controladorCompetencia = require('./controladorCompetencia')
var controladorGenero = require('./controladorGenero')
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express()

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', controladorCompetencia.obtenerCompetencias)
app.get('/competencias/:id/peliculas/', controladorCompetencia.obtenerOpciones)
app.post('/competencias/:id/voto', controladorCompetencia.agregarVoto)
app.get('/competencias/:id/resultados', controladorCompetencia.obtenerResultados)
app.post('/competencias', controladorCompetencia.crearCompetencia)
app.delete('/competencias/:id/votos', controladorCompetencia.reiniciarCompetencia)

app.get('/generos', controladorGenero.obtenerGenero)



var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

