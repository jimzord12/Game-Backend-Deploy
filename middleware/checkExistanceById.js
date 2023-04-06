const database = require("../model/database");

const checkExistanceById = (req, res, table, idName = "id") => {
  const q = `SELECT EXISTS(SELECT * FROM ${table} WHERE ${idName}=${parseInt(
    req.params.id
  )});`;

  database.query(q, (err) => {
    if (err) {
      console.log(
        `Error Accured while trying to check if entity with ID: ${parseInt(
          req.params.id
        )} exists...`
      );
      return res.status(500).json(err);
    }
    console.log("Entity Exists");
    return res.status(200).json({ exists: true });
  });
};

exports = {
  checkExistanceById,
};
