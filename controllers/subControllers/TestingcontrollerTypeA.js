const {
  getStaff,
  putStaff,
  postStaff,
  deleteStaff,
} = require("../../model/sqlQueries/Testing_dbFunctions");
// const desiredTable = "achievements";

const controller = (req, res, table, method, config, indentifier) => {
  // const desiredTable = table
  if (method.toLowerCase() === "get")
    getStaff(req, res, table, config, indentifier);
  if (method.toLowerCase() === "post") postStaff(req, res, table, config);
  if (method.toLowerCase() === "put") putStaff(req, res, table, config);
  if (method.toLowerCase() === "delete") deleteStaff(req, res, table);
};

module.exports =
  // getAllRows,
  // createNewRow,
  // updateRow,
  // deleteRow,
  // getRow,
  controller;
