var con = require("./conexionbd")

function obtenerActor(req,res){

    
    var sqlActores = "SELECT * FROM actor"

    con.query(sqlActores, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        // var response = resultado
        res.send(JSON.stringify(resultado)) 

    })

}

module.exports = {
    obtenerActor: obtenerActor
}