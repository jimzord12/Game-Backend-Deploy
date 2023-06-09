require("dotenv").config();

const testDB = {
  host: "localhost",
  user: "root",
  password: "root12345",
  database: "test",
};

const productionDB = {
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b2de911c23da88",
  password: process.env.DATABASE_PASSWORD,
  database: "heroku_7856f26f9d49a1e",
  dialect: "mysql",
};

module.exports = { testDB, productionDB };
