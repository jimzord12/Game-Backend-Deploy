const express = require("express");
const router = express.Router();

const quizQuestionsCntl = require("../../controllers/subControllers/quizQuestionsCntl");

router.route("/").get(quizQuestionsCntl);

module.exports = router;
