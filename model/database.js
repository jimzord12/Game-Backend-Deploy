//
const { testDB, productionDB } = require("../config/dbConfig");
const mysql = require("mysql");

const isProduction = true;
//
const dbConfig = isProduction ? productionDB : testDB;
// const database = mysql.createConnection(testDB);
const database = mysql.createConnection(dbConfig);

module.exports = database;
