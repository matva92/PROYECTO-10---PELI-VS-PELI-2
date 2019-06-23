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
    var sqlPeliculas = "SELECT *, id as pelicula_id FROM pelicula ORDER BY RAND() LIMIT 2;"

    con.query(sqlparametrosCompetencia, function(error, resultado, fields){
        

        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }

        if(resultado[0].genero_id > 0 && resultado[0].director_id > 0 && resultado[0].actor_id > 0){
            sqlPeliculas = "SELECT * FROM pelicula pe LEFT JOIN director_pelicula dp on dp.pelicula_id = pe.id LEFT JOIN actor_pelicula ap on ap.pelicula_id = pe.id WHERE genero_id = "+ resultado[0].genero_id +" AND director_id = " + resultado[0].director_id +" AND ap.actor_id = " + resultado[0].actor_id + " ORDER BY RAND() LIMIT 2;"
        } else if (resultado[0].genero_id > 0 && resultado[0].director_id > 0 && resultado[0].actor_id == null){
            sqlPeliculas = "SELECT * FROM pelicula pe LEFT JOIN director_pelicula dp on dp.pelicula_id = pe.id WHERE pe.genero_id = " + resultado[0].genero_id + " AND dp.director_id = " + resultado[0].director_id + " ORDER BY RAND() LIMIT 2;"
        } else if (resultado[0].genero_id > 0 && resultado[0].director_id == null && resultado[0].actor_id > 0){
            sqlPeliculas = "SELECT * FROM pelicula pe LEFT JOIN actor_pelicula ap on ap.pelicula_id = pe.id WHERE pe.genero_id = " + resultado[0].genero_id + " AND ap.actor_id = " + resultado[0].actor_id + " ORDER BY RAND() LIMIT 2;"
        } else if (resultado[0].genero_id == null && resultado[0].director_id > 0 && resultado[0].actor_id > 0){
            sqlPeliculas = "SELECT * FROM pelicula pe LEFT JOIN director_pelicula dp on dp.pelicula_id = pe.id LEFT JOIN actor_pelicula ap on ap.pelicula_id = pe.id WHERE dp.director_id = " + resultado[0].director_id + " AND ap.actor_id = " + resultado[0].actor_id + " ORDER BY RAND() LIMIT 2;"
        } else if (resultado[0].genero_id == null && resultado[0].director_id == null && resultado[0].actor_id > 0){
            sqlPeliculas = "SELECT * FROM pelicula pe LEFT JOIN actor_pelicula ap on ap.pelicula_id = pe.id WHERE ap.actor_id = " + resultado[0].actor_id + " ORDER BY RAND() LIMIT 2;"
        } else if (resultado[0].genero_id == null && resultado[0].director_id > 0  && resultado[0].actor_id == null){
            sqlPeliculas = "SELECT * FROM pelicula pe LEFT JOIN director_pelicula dp on dp.pelicula_id = pe.id  WHERE dp.director_id = " + resultado[0].director_id + " ORDER BY RAND() LIMIT 2;"
        } else if (resultado[0].genero_id > null && resultado[0].director_id == null && resultado[0].actor_id == null){
            sqlPeliculas = "SELECT * FROM pelicula pe  WHERE genero_id = " + resultado[0].genero_id + " ORDER BY RAND() LIMIT 2;"
        } 
        
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
    var sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
    LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
    WHERE genero_id = ` + generoCompetencia + ` AND director.id = ` + directorCompentencia + ` AND actor_pelicula.actor_id = ` + actorCompetencia
    var sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id, director_id, actor_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia + `', `+ directorCompentencia +`', '`+ actorCompetencia + `')`


    if(generoCompetencia == 0 && directorCompentencia == 0 && actorCompetencia == 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia)
       VALUES('`+ nombreCompetencia +`')`
        sqlPeliculasExistentes = `SELECT * FROM pelicula`
    } else if(generoCompetencia > 0 && directorCompentencia == 0 && actorCompetencia == 0) {
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia +`')`
        sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
     LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
     WHERE genero_id = ` + generoCompetencia
    } else if(generoCompetencia > 0 && directorCompentencia > 0 && actorCompetencia == 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id, director_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia + `', '`+ directorCompentencia +`')`
     sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
    LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
    WHERE genero_id = ` + generoCompetencia + ` AND director.id = ` + directorCompentencia
    } else if (generoCompetencia > 0 && directorCompentencia == 0 && actorCompetencia > 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id, actor_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia + `', '`+ actorCompetencia + `')`
     sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
     LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
     WHERE genero_id = ` + generoCompetencia +  ` AND actor_pelicula.actor_id = ` + actorCompetencia
    } else if(generoCompetencia == 0 && directorCompentencia > 0 && actorCompetencia > 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, director_id, actor_id)
     VALUES('`+ nombreCompetencia +`', '` + directorCompentencia +`', '`+ actorCompetencia + `')`
     sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
     LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
     WHERE director.id = ` + directorCompentencia + ` AND actor_pelicula.actor_id = ` + actorCompetencia
    } else if(generoCompetencia == 0 && directorCompentencia > 0 && actorCompetencia == 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, director_id)
     VALUES('`+ nombreCompetencia +`', '` + directorCompentencia + `')`
     sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
     LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
     WHERE director.id = ` + directorCompentencia
    } else if(generoCompetencia > 0 && directorCompentencia > 0 && actorCompetencia > 0){
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, genero_id, director_id, actor_id)
     VALUES('`+ nombreCompetencia +`', '`+ generoCompetencia +`', '`+ directorCompentencia +`', '` + actorCompetencia + `')`
     sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
     LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
     WHERE genero_id = ` + generoCompetencia + ` AND director.id = ` + directorCompentencia + ` AND actor_pelicula.actor_id = ` + actorCompetencia
    } 
    else if (generoCompetencia == 0 && directorCompentencia == 0 && actorCompetencia > 0) {
        sqlNuevaCompetencia = `INSERT INTO competencias (competencia, actor_id)
     VALUES('`+ nombreCompetencia +`', '`+ actorCompetencia + `')`
     sqlPeliculasExistentes = `SELECT distinct pelicula.id FROM pelicula LEFT JOIN director on director.nombre = pelicula.director
     LEFT JOIN actor_pelicula on actor_pelicula.pelicula_id = pelicula.id 
     WHERE actor_pelicula.actor_id = ` + actorCompetencia
    }

 

    con.query(sqlcompetenciasExistentes, function(error, resultado, fields){
       
        if(resultado[0] != undefined){
            console.log("Hubo un error en la solicitud.")
            return res.status(422).send('No se pudo procesar su pedido. Puede ser que ya exista una competencia con ese nombre.')
        }
        con.query(sqlPeliculasExistentes, function(error, resultado, fields){
            console.log(sqlPeliculasExistentes)
            console.log(resultado)
            
            if(resultado == undefined || resultado.length < 2){
                console.log("Hubo un error en la solicitud.")
                return res.status(422).send('No se pudo procesar su pedido. No hay suficientes películas para crear esta competencia.')
            }
            
            con.query(sqlNuevaCompetencia, function(error, resultado, fields){
            
                if(error){
                    console.log("Hubo un error en la consulta", error.message)
                    return res.status(404).send("No se pudo procesar su pedido.")
                }
                res.send(console.log("Competencia creada correctamente."))    
            })

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

  function eliminarCompetencia(req, res){
    var competenciaId = parseInt(req.params.id)
    var sqlDelete = "DELETE FROM votos WHERE competencia_id = " + competenciaId + "; DELETE FROM competencias WHERE id = " + competenciaId
    
      con.query(sqlDelete, function(error, resultado, fields){
          if(error){
              console.log("Hubo un error en la solicitud", error.message)
              return res.status(404).send("No se pudo procesar la solicitud.")
          }

          res.send(console.log("Competencia eliminada correctamente."))
      })
  }

  function obtenerDetalleCompetencia(req, res){

      var competenciaId = parseInt(req.params.id)
      var sqlCompetencia = "SELECT competencias.competencia, genero.nombre as generoNombre, director.nombre as directorNombre, actor.nombre as actorNombre FROM competencias LEFT JOIN genero on genero.id = competencias.genero_id LEFT JOIN director on director.id = competencias.director_id LEFT JOIN actor on actor.id = competencias.actor_id WHERE competencias.id = " + competenciaId

      con.query(sqlCompetencia, function(error, resultado, fields){
          if(error){
              console.log("Hubo un error en la consulta", error.message)
              return res.status(404).send("No se pudo procesar la solicitud.")
          }


        var response = {
            'nombre': resultado[0].competencia,
            'genero_nombre': resultado[0].generoNombre,
            'actor_nombre': resultado[0].actorNombre,
            'director_nombre': resultado[0].directorNombre
        }
        

        res.send(JSON.stringify(response))
      })
  }

  function editarCompetencia(req, res){

    var idCompetencia = parseInt(req.params.id)
    var nombre = req.body.nombre
    var sqlNombre = "UPDATE competencias SET competencia = '" + nombre + "' WHERE id = " + idCompetencia
   

    con.query(sqlNombre, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la solicitud", error.message)
            return res.status(404).send("No se pudo procesar la solicitud.")
        }

      res.send(console.log("Nombre actualizado correctamente."))
    })
}

module.exports = {
    obtenerCompetencias: obtenerCompetencias,
    obtenerOpciones: obtenerOpciones,
    agregarVoto: agregarVoto,
    obtenerResultados: obtenerResultados,
    crearCompetencia: crearCompetencia,
    reiniciarCompetencia: reiniciarCompetencia,
    eliminarCompetencia: eliminarCompetencia,
    obtenerDetalleCompetencia: obtenerDetalleCompetencia,
    editarCompetencia: editarCompetencia
}