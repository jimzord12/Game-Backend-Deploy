const express = require("express");
const router = express.Router();

const googleFormCntl = require("../../controllers/subControllers/googleFormCntl");

router.route("/").get(googleFormCntl.getAllRows).post(googleFormCntl.createNewRow);


router
  .route("/:id")
  .get(googleFormCntl.getRow)
  .put(googleFormCntl.updateRow) 
  .delete(googleFormCntl.deleteRow);

module.exports = router;
