const express = require("express");
const router = express.Router();

const leaderboardPlCntl = require("../../controllers/subControllers/leaderboardPlCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router.route("/").get(leaderboardPlCntl.getAllRows).post(
  // -- Example Below: for using roles to restrict access
  // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),  // <-
  leaderboardPlCntl.createNewRow
);

// .put(
//   // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//   cardsCntl.updateRow
// )
// .delete(
//   // verifyRoles(ROLES_LIST.Admin),
//   cardsCntl.deleteRow
// );

router
  .route("/:id")
  .get(leaderboardPlCntl.getRow)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    leaderboardPlCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    leaderboardPlCntl.deleteRow
  );

module.exports = router;
