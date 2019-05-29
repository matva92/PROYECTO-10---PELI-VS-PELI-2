var con = require("./conexionbd")

function obtenerGenero(req,res){

    
    var sqlGeneros = "SELECT * FROM genero"

    con.query(sqlGeneros, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        // var response = resultado
        res.send(JSON.stringify(resultado)) 

    })

}

module.exports = {
    obtenerGenero: obtenerGenero
}