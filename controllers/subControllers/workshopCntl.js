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

  // Sanitizating request data
  if (isNaN(Number(id)) || Number(id) > 3) {
    return res.status(400).json({ message: "Provided ID is not valid" });
  }

  const q = `SELECT * FROM players WHERE name LIKE 'uniwa ws${id}%';`;
  const qParams = [`uniwa ws${id}`];

  if (!["2", "3"].includes(id)) {
    return res
      .status(400)
      .json({ message: "Available IDs for WorkShops are: [2, 3]" });
  }
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

  // Sanitizating request data
  if (isNaN(Number(id)) || Number(id) > 3) {
    return res.status(400).json({ message: "Provided ID is not valid" });
  }

  const qParams = `uniwa ws${id} ${studentId}`;
  const q = `SELECT * FROM players WHERE name LIKE '${qParams}%';`;

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
