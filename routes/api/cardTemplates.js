const express = require("express");
const router = express.Router();

const cardTemplatesCntl = require("../../controllers/subControllers/cardTemplatesCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router
  .route("/")
  .get(cardTemplatesCntl.getAllRows)
  // .get((req, res) => {
  //   const { getStaff } = require("../../model/sqlQueries/dbFunctions");
  //   getStaff(req, res, "card_templates");
  // })
  // -- Example: for using roles
  .post(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    cardTemplatesCntl.createNewRow
  );

// .put(
//   // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//   cardTemplatesCntl.updateCardTemplate
// )
// .delete(
//   // verifyRoles(ROLES_LIST.Admin),
//   cardTemplatesCntl.deleteCardTemplate
// );

router
  .route("/:id")
  .get(cardTemplatesCntl.getRow)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    cardTemplatesCntl.updateRow
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    cardTemplatesCntl.deleteRow
  );

module.exports = router;
