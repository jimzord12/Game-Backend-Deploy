const express = require("express");
const router = express.Router();
const refreshTokenController = require("../controllers/subControllers/refreshTokenController");

router.post("/", refreshTokenController.handleRefreshToken);

module.exports = router;
