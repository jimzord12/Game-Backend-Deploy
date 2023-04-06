const reqFieldsConfig = require("../../config/tableConfigs/cardsReqConfig");
const desiredTable = "cards";

// Tested with PostMan 👨‍🚀 - OK! ✅
const getAllCards = (req, res) => {
  const { getSpecificStaff } = require("../../model/sqlQueries/dbFunctions");
  getSpecificStaff(req, res, desiredTable, "ownerId");
};

// Tested with PostMan 👨‍🚀 - OK! ✅
// const getAllCardsAndStats = (req, res) => {
//   const { getStaff } = require("../../model/sqlQueries/dbFunctions");
//   getStaff(
//     req,
//     res,
//     desiredTable,
//     "ownerId",
//     "cards.*, card_stats.*",
//     "AllCardsAndStats"
//   );
// };

// Tested with PostMan 👨‍🚀 - OK! ✅
const createNewRow = (req, res) => {
  const { postStaff } = require("../../model/sqlQueries/dbFunctions");
  // Last argument is for the required fields or properties
  postStaff(req, res, desiredTable, reqFieldsConfig);

  // TODO: The check if player exists in DB,
  // using the checkExistanceById -> dbFunctions
  // MUST BE DONE FROM FRONTEND || Make it Middleware
};

// Tested with PostMan 👨‍🚀 - OK! ✅
const updateRow = (req, res) => {
  const { putStaff } = require("../../model/sqlQueries/dbFunctions");

  // Last argument is for the required fields or properties
  // in this case, we don't want to have required fields
  putStaff(req, res, desiredTable);

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

const throwError = (req, res) => {
  const { throwError } = require("../../model/sqlQueries/dbFunctions");

  throwError(req, res);

  // TODO: The check if player exists in DB,
  // using the checkExistanceById -> dbFunctions
  // MUST BE DONE FROM FRONTEND || Make it Middleware
};

module.exports = {
  getAllCards,
  // getAllCardsAndStats,
  createNewRow,
  updateRow,
  deleteRow,
  getRow,
  throwError,
};
