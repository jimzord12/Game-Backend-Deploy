const express = require("express");
const router = express.Router();

const workshopCntl = require("../../controllers/subControllers/...Cntl");

router.route("/").get(workshopCntl.getAllWorkshopUsers);
router.route("/:id").get(workshopCntl.getUsersFromSpecificWorkshop);
router
  .route("/:id/:studentId")
  .get(workshopCntl.getSpecificStudentFromWorkshop);

module.exports = router;
