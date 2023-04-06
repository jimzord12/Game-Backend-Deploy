const express = require("express");
const router = express.Router();

const achievTemplatesCntl = require("../../controllers/subControllers/achievTemplatesCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router.route("/").get(achievTemplatesCntl.getAllRows).post(
  // -- Example Below: for using roles to restrict access
  // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),  // <-
  achievTemplatesCntl.createNewRow
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
  .get(achievTemplatesCntl.getRow)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    achievTemplatesCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    achievTemplatesCntl.deleteRow
  );

module.exports = router;
