require("dotenv").config();

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

const productionDB = {
  host: "aws.connect.psdb.cloud",
  user: "dhc6x6fchbkz4soswgnd",
  password:
    process.env.IS_PRODUCTION === "no"
      ? process.env.DATABASE_PASSWORD
      : extractPassword(process.env.PLANETSCALE_DATABASE_URL),

  database: "genera-game-v3",
  // dialect: "mysql",
};

// model > database.js (This were this config is used!)

module.exports = { testDB, productionDB };
