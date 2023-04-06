// const reqFieldsConfig = require("../../config/tableConfigs/cardStatsReqConfig");
const desiredTable = "card_stats";

// Tested with PostMan 👨‍🚀 - OK! ✅
const getAllRows = (req, res) => {
  const { getStaff } = require("../../model/sqlQueries/dbFunctions");
  getStaff(req, res, desiredTable);
};

// Tested with PostMan 👨‍🚀 - OK! ✅
const createNewStats = (req, res) => {
  const { postStaff } = require("../../model/sqlQueries/dbFunctions");
  // Last argument is for the required fields or properties
  postStaff(req, res, desiredTable);

  // TODO: The check if player exists in DB,
  // using the checkExistanceById -> dbFunctions
  // MUST BE DONE FROM FRONTEND || Make it Middleware
};

// Tested with PostMan 👨‍🚀 - OK! ✅
const updateCardStats = (req, res) => {
  const { putStaff } = require("../../model/sqlQueries/dbFunctions");

  // Last argument is for the required fields or properties
  // in this case, we don't want to have required fields
  putStaff(req, res, desiredTable, [], "cardId");

  // TODO: The check if player exists in DB,
  // using the checkExistanceById -> dbFunctions
  // MUST BE DONE FROM FRONTEND || Make it Middleware
};

// Tested with PostMan 👨‍🚀 - OK! ✅
const deleteRow = (req, res) => {
  const { deleteStaff } = require("../../model/sqlQueries/dbFunctions");
  deleteStaff(req, res, desiredTable);

  // TODO: The check if player exists in DB,
  // using the checkExistanceById -> dbFunctions
  // MUST BE DONE FROM FRONTEND || Make it Middleware
};

// Tested with PostMan 👨‍🚀 - OK! ✅
const getRow = (req, res) => {
  const { getSpecificStaff } = require("../../model/sqlQueries/dbFunctions");

  getSpecificStaff(req, res, desiredTable);

  // TODO: The check if player exists in DB,
  // using the checkExistanceById -> dbFunctions
  // MUST BE DONE FROM FRONTEND || Make it Middleware
};

module.exports = {
  getAllRows,
  createNewStats,
  updateCardStats,
  deleteRow,
  getRow,
};
