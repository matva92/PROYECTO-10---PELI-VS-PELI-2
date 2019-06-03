var con = require("./conexionbd")

function obtenerCompetencias(req, res){
    var sqlCompetencias = "SELECT * FROM competencias"
    var sqlCompetenciasCount = "SELECT COUNT(*) AS COUNT FROM competencias"
    
    con.query(sqlCompetencias, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        con.query(sqlCompetenciasCount, function(error, resultado2, fields){
            if(error){
                console.log("Hubo un error en la consulta", error.message)
                return res.status(404).send("Hubo un error en la consulta")
            }
            var response = {
                'competencias': resultado,
                'length': resultado2[0].COUNT
            }
            res.send(JSON.stringify(response)) 
        })
    })
}

function obtenerOpciones(req, res){

    
    var idCompetencia = parseInt(req.params.id)
    var sqlCompetencia = "SELECT * FROM competencias WHERE id = " +  idCompetencia + ";"
      
    var sqlparametrosCompetencia = "SELECT genero_id, director_id, actor_id FROM competencias WHERE id = " + idCompetencia
    var sqlPeliculas = "SELECT * FROM pelicula ORDER BY RAND() LIMIT 2;"

    con.query(sqlparametrosCompetencia, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }

        if(resultado[0].genero_id > 0 && resultado[0].director_id > 0 && resultado[0].actor_id > 0){
            sqlPeliculas = "SELECT * FROM pelicula WHERE genero_id = "+ resultado[0].genero_id +" AND director_id = " + resultado[0].director_id +" AND actor_id = " + resultado[0].actor_id + " ORDER BY RAND() LIMIT 2;"
        }
    })



    con.query(sqlCompetencia, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        const competencia = resultado[0]

        con.query(sqlPeliculas, function(error, resultado2, fields){
            if(error){
                console.log("Hubo un error en la consulta", error.message)
                return res.status(404).send("Hubo un error en la consulta")
            }
            
            var response = {
                ...competencia,
                'peliculas': resultado2
            }
            res.send(JSON.stringify(response))
        })
    })

}

function agregarVoto(req, res){
    var idCompetencia = parseInt(req.params.id)
    var idPelicula = parseInt(req.body.idPelicula)

    var sqlVoto = "INSERT INTO votos (pelicula_id, competencia_id) VALUES (" + idPelicula + ", " + idCompetencia +")"

    con.query(sqlVoto, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
            res.send(console.log("Voto insertado correctamente."))
    })
}

function obtenerResultados(req, res){
    var idCompetencia = parseInt(req.params.id)
    var sqlResultados = `SELECT votos.pelicula_id, pelicula.titulo, pelicula.poster, COUNT(*) as votos 
        FROM votos
        LEFT JOIN pelicula on pelicula.id = votos.pelicula_id
        WHERE competencia_id = ` + idCompetencia + ` GROUP BY pelicula_id 
        ORDER BY Votos DESC 
        LIMIT 3;`

        con.query(sqlResultados, function(error, resultado, fields){
            if(error){
                console.log("Hubo un error en la consulta", error.message)
                return res.status(404).send("Hubo un error en la consulta")
            }
            var response = {
                'competencia': idCompetencia,
                'resultados': resultado
            }
            res.send(JSON.stringify(response))
        })
}

function crearCompetencia(req, res){
    var nombreCompetencia = req.body.nombre
    var generoCompetencia = req.body.genero
    var directorCompentencia = req.body.director
    var actorCompetencia = req.body.actor

    var sqlcompetenciasExistentes = `SELECT competencia FROM competencias WHERE competencia = '` + nombreCompetencia + `'`
    
    var sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id, director_id, actor_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia + `', `+ directorCompentencia +`', '`+ actorCompetencia + `')`

    if(generoCompetencia == 0 && directorCompentencia == 0 && actorCompetencia == 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia)
        VALUES('`+ nombreCompetencia +`')`
    } else if(generoCompetencia > 0 && directorCompentencia == 0 && actorCompetencia == 0) {
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia +`')`
    } else if(generoCompetencia > 0 && directorCompentencia > 0 && actorCompetencia == 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id, director_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia + `', '`+ directorCompentencia +`')`
    } else if (generoCompetencia > 0 && directorCompentencia == 0 && actorCompetencia > 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id, actor_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia + `', '`+ actorCompetencia + `')`
    } else if(generoCompetencia == 0 && directorCompentencia > 0 && actorCompetencia > 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, director_id, actor_id)
     VALUES('`+ nombreCompetencia +`', '` + directorCompentencia +`', '`+ actorCompetencia + `')`
    } else if(generoCompetencia == 0 && directorCompentencia > 0 && actorCompetencia == 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, director_id)
     VALUES('`+ nombreCompetencia +`', '` + directorCompentencia + `')`
    } else {
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, actor_id)
     VALUES('`+ nombreCompetencia +`', '`+ actorCompetencia + `')`
    }

    con.query(sqlcompetenciasExistentes, function(error, resultado, fields){
        if(resultado[0] != undefined){
            console.log("Hubo un error en la solicitud.")
            return res.status(422).send('No se pudo procesar su pedido. Puede ser que ya exista una competencia con ese nombre.')
        }

        con.query(sqlNuevaCompetencia, function(error, resultado, fields){
        
            if(error){
                console.log("Hubo un error en la consulta", error.message)
                return res.status(404).send("No se pudo procesar su pedido.")
            }
            res.send(console.log("Competencia creada correctamente."))    
        })
    })
}

function reiniciarCompetencia(req, res){
    var competenciaId = parseInt(req.params.id)
    var sqlDelete = `DELETE FROM votos WHERE competencia_id = '` + competenciaId + `'`

    con.query(sqlDelete, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("No se pudo procesar la solicitud. Puede ser que la competencia no exista.")
        }
        res.send(console.log("Competencia reiniciada correctamente."))
    }) 
  }

module.exports = {
    obtenerCompetencias: obtenerCompetencias,
    obtenerOpciones: obtenerOpciones,
    agregarVoto: agregarVoto,
    obtenerResultados: obtenerResultados,
    crearCompetencia: crearCompetencia,
    reiniciarCompetencia: reiniciarCompetencia
}