const express = require("express");
const router = express.Router();

const leaderboardAlCntl = require("../../controllers/subControllers/leaderboardAlCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router.route("/").get(leaderboardAlCntl.getAllRows).post(
  // -- Example Below: for using roles to restrict access
  // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),  // <-
  leaderboardAlCntl.createNewRow
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
  .get(leaderboardAlCntl.getRow)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    leaderboardAlCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    leaderboardAlCntl.deleteRow
  );

module.exports = router;