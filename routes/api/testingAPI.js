const express = require("express");
const router = express.Router();

const controllerTypeA = require("../../controllers/subControllers/TestingcontrollerTypeA");
// const ROLES_LIST = require("../../config/roles_list");
// const verifyRoles = require("../../middleware/verifyRoles"); // use this if you want to restrict access by using roles

router.route("/").get(controllerTypeA.getAll).post(
  // -- Example Below: for using roles to restrict access
  // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),  // <-
  controllerTypeA.createNew
);

// .put(
//   // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
//   controllerTypeA.update
// )
// .delete(
//   // verifyRoles(ROLES_LIST.Admin),
//   controllerTypeA.delete
// );

router
  .route("/:id")
  .get(controllerTypeA.get)
  .put(
    // verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    controllerTypeA.update
  )
  .delete(
    // verifyRoles(ROLES_LIST.Admin),
    controllerTypeA.delete
  );

module.exports = router;
