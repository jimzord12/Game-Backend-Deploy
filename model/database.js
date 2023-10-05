//
const { testDB, productionDB } = require("../config/dbConfig");
const mysql = require("mysql");

const isProduction = process.env.IS_PRODUCTION === "yes" ? true : false;
//
const dbConfig = isProduction ? productionDB : testDB;
// const database = mysql.createConnection(testDB);
const database = mysql.createPool(dbConfig);

module.exports = database;
