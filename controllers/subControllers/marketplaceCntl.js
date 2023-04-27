const desiredTable = "marketplace";

const createPurchase = (req, res) => {
  const { postStaff } = require("../../model/sqlQueries/dbFunctions");
  postStaff(req, res, desiredTable);
};

const deletePurchase = (req, res) => {
  const { deleteStaff } = require("../../model/sqlQueries/dbFunctions");
  deleteStaff(req, res, desiredTable, "cardId");
};

const getSoldCards = (req, res) => {
  const { getSpecificStaff } = require("../../model/sqlQueries/dbFunctions");

  getSpecificStaff(req, res, desiredTable, "sellerId");
};

module.exports = {
  createPurchase,
  deletePurchase,
  getSoldCards,
};
