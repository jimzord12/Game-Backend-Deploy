const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/subcontrollers/refreshTokenController");

router.post("/", refreshTokenController.handleRefreshToken);

module.exports = router;
