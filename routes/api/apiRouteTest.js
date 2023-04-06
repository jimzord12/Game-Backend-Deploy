const express = require("express");
const router = express.Router();

// Importing API's Route Controller/Handler
const controller = require("../../controllers/subControllers/TestingcontrollerTypeA");

// --- Create an API Route With 3 Steps! ---

// 1. Grab Required Fields
const reqFieldsConfig = require("../../config/tableConfigs/testingConfig");

// 2. Define the table you want to access
const desiredTable = "testing";

// 3. Add necessary arguments to the controller...
//    1st: Request
//    2nd: Response
//    3rd: The Desired Table
//    4th: The HTTP Method
//    5th: The Required Fields in the form of a Array 
//    6th: Optional: A Indetifier (Expeption -> GET by id)

router
  .route("/")
  .get((req, res) => controller(req, res, desiredTable, "get", reqFieldsConfig))
  .post(
    (req, res) => controller(req, res, desiredTable, "post", reqFieldsConfig)
  );


router
  .route("/:id")
  .get((req, res) =>
    controller(req, res, desiredTable, "get", reqFieldsConfig, "id")
  )
  .put(
    // In "PUT" the 6th Argument defaults to 'id'
    (req, res) => controller(req, res, desiredTable, "put", reqFieldsConfig)
  )
  .delete(
    // In "DELETE" the 6th Argument defaults to 'id'
    (req, res) => controller(req, res, desiredTable, "delete", reqFieldsConfig)
  );

module.exports = router;
