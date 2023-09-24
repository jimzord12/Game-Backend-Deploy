const express = require("express");
const router = express.Router();
const authControllerNoPwd = require("../controllers/subControllers/authControllerNoPwd");
const web3authController = require("../controllers/subControllers/web3AuthController");

// router.post("/", authControllerNoPwd.handleLogin);
router.post("/", authControllerNoPwd.handleLogin2);
router.post("/web3Auth", web3authController.web3Login);

module.exports = router;
