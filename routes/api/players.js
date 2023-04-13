const express = require("express");
const router = express.Router();

const playersCntl = require("../../controllers/subControllers/playersCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router
  .route("/") // In reality we are in "domain:Port/players/", NOT: "domain:Port/"
  .get(playersCntl.getAllPlayers)
  // -- Example: for using roles
  .post(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    playersCntl.createNewPlayer
  );

// .put(
//   // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//   playersCntl.updatePlayer
// )
// .delete(
//   // verifyRoles(ROLES_LIST.Admin),
//   playersCntl.deletePlayer
// );

router
  .route("/:wallet(0x[a-fA-F0-9]{40})")
  .get(playersCntl.getEverythingByWallet)
  // .get(playersCntl.getPlayerByWallet)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    playersCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    playersCntl.deleteRow
  );

router
  .route("/:name([a-zA-Z][a-zA-Z0-9 ]*)")
  // .get(playersCntl.getPlayerByName)
  .get(playersCntl.getEverythingByName)
  .post(playersCntl.createNewPlayer)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    playersCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    playersCntl.deleteRow
  );

router
  .route("/:id([0-9]+)")
  .get(playersCntl.getRow)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    playersCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    playersCntl.deleteRow
  );

module.exports = router;
