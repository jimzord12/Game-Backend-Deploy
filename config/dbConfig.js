require("dotenv").config();
const fs = require("fs");
const path = require("path");

function extractPassword(mysqlUrl) {
  const regex = /(?<=:\/\/[^:]+:)[^@]+(?=@)/;
  const match = mysqlUrl.match(regex);
  return match ? match[0] : null;
}

const testDB = {
  host: "localhost",
  user: "root",
  password: "1421Jimmy!1421",
  database: "genera_v2_db",
};

const dockerTestDB = {
  host: process.env.DOCKER_LOCAL_DB_HOST,
  user: process.env.DOCKER_LOCAL_DB_USER,
  password: process.env.DOCKER_LOCAL_DB_PASSWORD,
  database: process.env.DOCKER_LOCAL_DB_NAME,
};

const dockerProdDB = {
  host: process.env.DOCKER_PROD_DB_HOST,
  user: process.env.DOCKER_PROD_DB_USER,
  password: process.env.DOCKER_PROD_DB_PASSWORD,
  database: process.env.DOCKER_PROD_DB_NAME,
};

// ✨ OLD - Heroku
// const productionDB = {
//   host: "eu-cdbr-west-03.cleardb.net",
//   user: "b2de911c23da88",
//   password:
//     process.env.IS_PRODUCTION === "no"
//       ? process.env.DATABASE_PASSWORD
//       : extractPassword(process.env.PLANETSCALE_DATABASE_URL),

//   database: "heroku_7856f26f9d49a1e",
//   dialect: "mysql",
// };

// ✨ OLD - PlanetScale
// const productionDB = {
//   host: "aws.connect.psdb.cloud",
//   user: "dhc6x6fchbkz4soswgnd",
//   password: extractPassword(process.env.PLANETSCALE_DATABASE_URL),
//   database: "genera-game-v3",
//   ssl: {
//     // This enables SSL
//     rejectUnauthorized: true,
//   },
//   // dialect: "mysql",
// };

// ✨ AIVEN
const productionDB = {
  host: process.env.AIVEN_DATABASE_HOST,
  user: process.env.AIVEN_DATABASE_USER,
  port: process.env.AIVEN_DATABASE_PORT,
  password: extractPassword(process.env.AIVEN_DATABASE_URL),
  database: process.env.AIVEN_DATABASE_NAME,
  ssl: {
    // This enables SSL
    rejectUnauthorized: true,
    ca: fs
      .readFileSync(
        path.join(__dirname, "..", "config", "certificate", "ca.pem")
      )
      .toString(),
  },
  // dialect: "mysql",
};

// model > database.js (This were this config is used!)

module.exports = { testDB, productionDB, dockerTestDB, dockerProdDB };
