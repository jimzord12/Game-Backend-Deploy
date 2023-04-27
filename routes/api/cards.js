const express = require("express");
const router = express.Router();

const cardsCntl = require("../../controllers/subControllers/cardsCntl");

router.route("/").get(cardsCntl.getAllRows).post(cardsCntl.createNewRow);

router.route("/marketplace").get(cardsCntl.getAllCardsForSale);
router.route("/marketplace/:id").put(cardsCntl.updateOwner);

router
  .route("/:id")
  .get(cardsCntl.getRow)
  .put(cardsCntl.updateRow)
  .delete(cardsCntl.deleteRow);

module.exports = router;
