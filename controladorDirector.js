var con = require("./conexionbd")

function obtenerDirector(req,res){ 

    
    var sqlDirectores = "SELECT * FROM director"

    con.query(sqlDirectores, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        // var response = resultado
        res.send(JSON.stringify(resultado)) 

    })

}

module.exports = {
    obtenerDirector: obtenerDirector
}