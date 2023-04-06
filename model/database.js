//
const { testDB } = require("../config/dbConfig");
const mysql = require("mysql");

const database = mysql.createConnection(testDB);

module.exports = database;
