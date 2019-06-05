 var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'Lenovo2026',
  database: 'competencias',
  multipleStatements: true
});

module.exports = connection;