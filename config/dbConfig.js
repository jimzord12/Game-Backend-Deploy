const parseMysqlUrl = require("../utils/parsingTools");

require("dotenv").config();

// function extractPassword(mysqlUrl) {
//   const regex = /(?<=:\/\/[^:]+:)[^@]+(?=@)/;
//   const match = mysqlUrl.match(regex);
//   return match ? match[0] : null;
// }

const testDB = {
  host: "localhost",
  user: "root",
  password: "root12345",
  database: "test",
};

const databaseConfig = parseMysqlUrl(process.env.PLANETSCALE_DATABASE_URL);

const productionDB = {
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.databaseName,
  ssl: {
    rejectUnauthorized: databaseConfig.ssl.rejectUnauthorized,
  },
  dialect: "mysql",
};
// OLD Production - Heroku ClearDB
// const productionDB = {
//   host: "eu-cdbr-west-03.cleardb.net",
//   user: "b2de911c23da88",
//   password:
//     process.env.IS_PRODUCTION === "no"
//       ? process.env.DATABASE_PASSWORD
//       : extractPassword(process.env.CLEARDB_DATABASE_URL),

//   database: "heroku_7856f26f9d49a1e",
//   dialect: "mysql",
// };

// model > database.js (This were this config is used!)

module.exports = { testDB, productionDB };
