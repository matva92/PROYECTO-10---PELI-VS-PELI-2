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
    // var sqlCompetenciaCount = "SELECT COUNT(*) AS COUNT FROM competencias WHERE id = " +  idCompetencia + ";"
    var sqlPeliculas = "SELECT * FROM pelicula ORDER BY RAND() LIMIT 2;"

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
    var sqlcompetenciasExistentes = `SELECT competencia FROM competencias WHERE competencia = '` + nombreCompetencia + `'`
    var sqlNuevaCompetencia = `INSERT INTO competencias (competencia)
    VALUES('`+ nombreCompetencia +`')`

    con.query(sqlcompetenciasExistentes, function(error, resultado, fields){

        if(resultado){
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

module.exports = {
    obtenerCompetencias: obtenerCompetencias,
    obtenerOpciones: obtenerOpciones,
    agregarVoto: agregarVoto,
    obtenerResultados: obtenerResultados,
    crearCompetencia: crearCompetencia

}