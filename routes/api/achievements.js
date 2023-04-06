const express = require("express");
const router = express.Router();

const achievementsCntl = require("../../controllers/subControllers/achievementsCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router.route("/").get(achievementsCntl.getAllRows).post(
  // -- Example Below: for using roles to restrict access
  // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),  // <-
  achievementsCntl.createNewRow
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
  .get(achievementsCntl.getRow)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    achievementsCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    achievementsCntl.deleteRow
  );

module.exports = router;
