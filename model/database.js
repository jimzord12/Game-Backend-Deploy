// // OLD
// const { testDB, productionDB } = require("../config/dbConfig");
// const mysql = require("mysql");

// const isProduction = process.env.IS_PRODUCTION === "yes" ? true : false;
// //
// const dbConfig = isProduction ? productionDB : testDB;
// // const database = mysql.createConnection(testDB);
// const database = mysql.createPool(dbConfig);

// module.exports = database;

const mysql = require("mysql");
const {productionDB, testDB} = require("../config/dbConfig");

// Assuming parseMysqlUrl is defined elsewhere or in the same file
// const { parseMysqlUrl } = require("./path-to-parseMysqlUrl");

// Your original config or URL
// const testDbUrl = "mysql://..."; // Replace with actual test DB URL
// const productionDbUrl = "mysql://..."; // Replace with actual production DB URL

const isProduction = process.env.IS_PRODUCTION === "yes";

// const testDB = parseMysqlUrl(testDbUrl);
// const productionDB = parseMysqlUrl(productionDbUrl);

const dbConfig = isProduction ? productionDB : testDB;

// Create a MySQL connection or pool with SSL options if present
const database = dbConfig.ssl
  ? mysql.createPool({
      ...dbConfig,
      ssl: {
        rejectUnauthorized: dbConfig.ssl.rejectUnauthorized,
      },
    })
  : mysql.createPool(dbConfig);

module.exports = database;
