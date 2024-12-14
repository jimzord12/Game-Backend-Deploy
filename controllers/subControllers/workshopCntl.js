const database = require("../../model/database");

const getAllWorkshopUsers = (req, res) => {
  const q = `SELECT * FROM players WHERE name COLLATE utf8mb4_general_ci LIKE ?`;

  database.query(q, ["uniwa ws%"], (err, data) => {
    if (err) {
      console.error("[WORKSHOP - ENDPOINT] - Error reading from DB:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};

const getUsersFromSpecificWorkshop = (req, res) => {
  const { id } = req.params;

  const q = `SELECT * FROM players WHERE name COLLATE utf8mb4_general_ci = ?`;
  const qParams = [`uniwa ws${id}`];

  database.query(q, qParams, (err, data) => {
    if (err) {
      console.error("[WORKSHOP ENDPOINT] - Error reading from DB:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json(data);
  });
};

const getSpecificStudentFromWorkshop = (req, res) => {
  const { id, studentId } = req.params;

  const q = `SELECT * FROM players WHERE name COLLATE utf8mb4_general_ci = ?`;
  const qParams = [`uniwa ws${id} ${studentId}`];

  database.query(q, qParams, (err, data) => {
    if (err) {
      console.error("[STUDENT ENDPOINT] - Error reading from DB:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // Check if the student exists
    if (data.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json(data[0]);
  });
};

module.exports = {
  getAllWorkshopUsers,
  getUsersFromSpecificWorkshop,
  getSpecificStudentFromWorkshop,
};
