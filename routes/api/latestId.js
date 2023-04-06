const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const database = require("../../model/database");

const getLatestId = (req, res) => {
  const tableName = req.params.table;
  console.log("Latest ID::The tableName: ", tableName);
  const query = `SELECT MAX(id) as latest_id FROM ${mysql.escapeId(tableName)}`;

  database.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the latest ID." });
    } else {
      res.status(200).json({ latest_id: results[0].latest_id });
    }
  });
};

router.route("/:table").get(getLatestId);

module.exports = router;
