const database = require("../model/database");

const getAllTables = (req, res) => {
  const q = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' AND TABLE_SCHEMA = 'test'`;
  database.query(q, (err, data) => {
    if (err) return res.json(err);
    console.log("The table Data was successfully sented");
    return res.json(data);
  });
};

module.exports = getAllTables;
