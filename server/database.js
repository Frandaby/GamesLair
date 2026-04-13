const mysql = require("mysql2");
//dotenv para obtener las claves dentro de .env, pero que no se mandarán a github (Están en el documento).
require("dotenv").config();
const database = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD,
    database: "gameslair",
  })
  .promise();

module.exports = database;
