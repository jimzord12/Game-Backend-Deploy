const express = require("express");
const router = express.Router();

const playerCardsCntl = require("../../controllers/subControllers/playerCardsCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router.route("/").get(playerCardsCntl.throwError);

// .put(
//   // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//   cardsCntl.updateRow
// )
// .delete(
//   // verifyRoles(ROLES_LIST.Admin),
//   cardsCntl.deleteRow
// );

router
  .route("/:ownerId")
  // .get(playerCardsCntl.getAllCardsAndStats)
  .get(playerCardsCntl.getAllCards)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    playerCardsCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    playerCardsCntl.deleteRow
  );

module.exports = router;
