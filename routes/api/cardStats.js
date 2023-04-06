const express = require("express");
const router = express.Router();

const cardStatsCntl = require("../../controllers/subControllers/cardStatsCntl");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router.route("/").get(cardStatsCntl.getAllRows).post(
  // -- Example Below: for using roles to restrict access
  // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),  // <-
  cardStatsCntl.createNewStats
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
  .get(cardStatsCntl.getRow)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    cardStatsCntl.updateCardStats
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    cardStatsCntl.deleteRow
  );

module.exports = router;
