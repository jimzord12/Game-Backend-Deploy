//
const {
  testDB,
  productionDB,
  dockerTestDB,
  dockerProdDB,
} = require("../config/dbConfig");
const mysql = require("mysql2");

const isProduction = process.env.IS_PRODUCTION === "yes" ? true : false;
const isDocker = process.env.IS_DOCKER === "yes" ? true : false;

let dbConfig;

if (isProduction && !isDocker) {
  console.log("🚀 Environment: [Production] Database");
  dbConfig = productionDB;
} else if (isProduction && isDocker) {
  console.log("🐳 Environment: [Production] + [Docker] Database");
  dbConfig = dockerProdDB;
} else if (isDocker && !isProduction) {
  console.log("🐳 Environment: [DEV] + [Docker] Database");
  dbConfig = dockerTestDB;
} else if (!isProduction && !isDocker) {
  console.log("🧪 Environment: [DEV] Test Database");
  dbConfig = testDB;
} else {
  console.log("❌ |PANIC| -- No Database Configuration Found! -- |PANIC|");
  throw new Error(" |PANIC| -- No Database Configuration Found! -- |PANIC|");
}
//
// const dbConfig = isProduction ? productionDB : testDB;
// const database = mysql.createConnection(testDB);
const database = mysql.createPool(dbConfig);
// console.log(database);

module.exports = database;
