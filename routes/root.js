const express = require("express");
const router = express.Router();
const path = require("path");

router
  .get("^/$|/index(.html)?", (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  })
  .get("/tables"),
  (req, res) => {
    const { getAllTables } = require("../model/sqlQueries/dbFunctions");
    getAllTables(req, res);
  };

module.exports = router;
