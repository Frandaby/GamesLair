const mysql = require("mysql2");
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
