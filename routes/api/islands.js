const express = require("express");
const router = express.Router();

const islandsCntl = require("../../controllers/subControllers/islandsCntl");

router.route("/").get(islandsCntl.getAllRows).post(islandsCntl.createNewRow);

router
  .route("/:id")
  .get(islandsCntl.getRow)
  .put(islandsCntl.updateRow)
  .delete(islandsCntl.deleteRow);

module.exports = router;
