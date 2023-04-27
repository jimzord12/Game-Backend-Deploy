const express = require("express");
const router = express.Router();

const marketplaceCntl = require("../../controllers/subControllers/marketplaceCntl");

router
  .route("/")
  .post(marketplaceCntl.createPurchase)
  .delete(marketplaceCntl.deletePurchase);

router.route("/:id").get(marketplaceCntl.getSoldCards);

module.exports = router;
