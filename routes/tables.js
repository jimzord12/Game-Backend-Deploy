const express = require("express");
const router = express.Router();
const getAllTables = require("../controllers/tablesController");

router.get("/", getAllTables);

module.exports = router;
