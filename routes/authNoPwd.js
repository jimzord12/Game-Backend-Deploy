const express = require("express");
const router = express.Router();
const authControllerNoPwd = require("../controllers/subControllers/authControllerNoPwd");

router.post("/", authControllerNoPwd.handleLogin);

module.exports = router;
