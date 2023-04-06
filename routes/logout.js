const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/subControllers/logoutController");

router.post("/", logoutController.handleLogout);

module.exports = router;
