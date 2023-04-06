const express = require("express");
const router = express.Router();
// const registerController = require('../controllers/registerController');
const registerController = require("../controllers/subControllers/registerController");

router.post("/", registerController.handleNewUser);
router.post("/player", registerController.handleNewPlayer);

module.exports = router;
