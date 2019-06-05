var express = require('express')
var controladorCompetencia = require('./controladorCompetencia')
var controladorGenero = require('./controladorGenero')
var controladorDirector = require('./controladorDirector')
var controladorActor = require('./controladorActor')
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express()

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', controladorCompetencia.obtenerCompetencias)
app.get('/competencias/:id', controladorCompetencia.obtenerDetalleCompetencia)
app.get('/competencias/:id/peliculas/', controladorCompetencia.obtenerOpciones)
app.get('/competencias/:id/resultados', controladorCompetencia.obtenerResultados)

app.post('/competencias', controladorCompetencia.crearCompetencia)
app.post('/competencias/:id/voto', controladorCompetencia.agregarVoto)

app.put('/competencias/:id', controladorCompetencia.editarCompetencia) 

app.delete('/competencias/:id/votos', controladorCompetencia.reiniciarCompetencia)
app.delete('/competencias/:id', controladorCompetencia.eliminarCompetencia)


app.get('/generos', controladorGenero.obtenerGenero)
app.get('/directores', controladorDirector.obtenerDirector)
app.get('/actores', controladorActor.obtenerActor)




var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

