const database = require("../database");

// Internal Helper Function
const checkRequiredFields = (configArray, fields) => {
  if (configArray === "none") return { success: true };

  if (!configArray || !Array.isArray(configArray) || !configArray.length > 0)
    return { success: false, message: "Problems with config file!" };

  for (const reqField of configArray) {
    if (!Object.keys(fields).includes(reqField)) {
      if (configArray.length > 2) {
        const lastElement = configArray.pop();
        return {
          message: `The following fields are required: ${configArray.join(
            ", "
          )} and ${lastElement}.`,
          success: false,
        };
      }

      if (configArray.length === 2) {
        // lastElement = configArray.pop();
        return {
          message: `The following fields are required: ${configArray[0]}, ${configArray[1]}.`,
          success: false,
        };
      }

      return {
        message: `The following fields are required: ${configArray.toString()}.`,
        success: false,
      };
    }
  }

  return { success: true };
  // }
};

const getStaff = (req, res, table, config, indentifier, select = "*") => {
  let q = "";

  // If there is an ID, store it for later use
  const entityId = req?.params?.id ? parseInt(req.params.id) : false;
  const { name, password } = req.body;

  if (!indentifier || indentifier === "_") {
    q = `SELECT ${select} FROM ${table}`;
  } else {
    q = `SELECT ${select} FROM ${table} WHERE ${indentifier} = ?`;
  }

  console.log("From GetStaff: ", q);

  if (indentifier && indentifier !== "_") {
    database.query(q, [name], (err, data) => {
      if (err) {
        console.log("Error Accured while trying to get Specific staff...");
        return res.status(500).json(err);
      }

      if (data.length === 0) {
        // If data is a falsy value, in this case an empty Array
        const customError = new Error(
          `The Requested '${table.slice(
            0,
            -1
          )}', with ID: '${entityId}' does not exists!`
        );
        console.log(customError);
        return res.status(404).json(customError.message);
      }

      console.log("Specific Data were successfully retrieved from DB");
      return res.status(200).json(data);
    });
  } else if (entityId) {
    console.log("================= 1 ==============");

    // If We have an ID in the URL...
    database.query(q, [entityId], (err, data) => {
      if (err) {
        console.log("Error Accured while trying to get Specific staff...");
        return res.status(500).json(err);
      }

      if (data.length === 0) {
        // If data is a falsy value, in this case an empty Array
        const customError = new Error(
          `The Requested '${table.slice(
            0,
            -1
          )}', with ID: '${entityId}' does not exists!`
        );
        console.log(customError);
        return res.status(404).json(customError.message);
      }

      console.log("Specific Data were successfully retrieved from DB");
      return res.status(200).json(data);
    });
  } else {
    console.log("================ 2 ===============");

    // If We do NOT have an ID in the URL...
    database.query(q, (err, data) => {
      if (err) {
        console.log("Error Accured while trying to get staff...");
        return res.status(500).json(err);
      }

      if (data.length === 0) {
        // If data is a falsy value, in this case an empty Array
        const customError = new Error(
          `The Requested '${table.slice(
            0,
            -1
          )}', with ID: '${entityId}' does not exists!`
        );
        console.log(customError);
        return res.status(404).json(customError.message);
      }
      console.log("Data were successfully retrieved from DB");
      return res.status(200).json(data);
    });
  }
};

const postStaff = (req, res, to, requiredFields) => {
  let q = "";
  const quote = "`";
  let values = [];
  let sqlProps = [];
  // let lastElement = "";

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      success: false,
      message: `How do you expect to update anything, if you do not provide data?! 😤`,
    });

  const { success, message } = checkRequiredFields(requiredFields, req.body);
  if (!success) return res.status(400).json(message);

  // Storing data to construct SQL query
  for (const [key, value] of Object.entries(req.body)) {
    const sqlKey = quote + key + quote;
    sqlProps.push(sqlKey);
    values.push(value);
  }

  if (typeof to === "string") {
    q = `INSERT INTO ${to} (${[...sqlProps]}) VALUES (?)`;
    console.log("DB Functions -> PostStaff SQL Query: ", q);
  }

  if (Array.isArray(to)) {
    q = `INSERT INTO ${to} (${quote + to + quote}) VALUES (?)`;
    console.log("DB Functions -> PostStaff SQL Query: ", q);
  }

  database.query(q, [values], (err, data) => {
    if (err) {
      console.log("Error Accured while trying to post staff...");
      console.log(values);
      return res.status(500).json(err);
    }
    console.log("New Data were successfully saved to DB");
    return res.status(201).json(data);
  });
};

const putStaff = (req, res, to, requiredFields, indentifier = "id") => {
  const entityId = req?.params?.id
    ? parseInt(req.params.id)
    : res.status(400).json({
        success: false,
        message: `How do you expect to update a specific element, if you do not provide an ID?! 😡`,
      });

  let values = [];
  let sqlProps = [];
  let q = "";
  const quote = "`";

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      success: false,
      message: `How do you expect to update anything, if you do not provide data?! 😤`,
    });

  const { success, message } = checkRequiredFields("none");
  if (!success) return res.status(400).json(message);

  for (const [key, value] of Object.entries(req.body)) {
    const sqlKey = quote + key + quote + " =" + " ?";
    // if(cb(key, value)) return res.status(400).json({ "message": `Employee ID ${req.body.id} not found` });
    sqlProps.push(sqlKey);
    values.push(value);
  }
  console.log(sqlProps);

  q = `UPDATE ${to} SET ${[...sqlProps]} WHERE ${indentifier} = ?`;
  console.log("DB Functions -> PutStaff SQL Query: ", q);

  database.query(q, [...values, entityId], (err, data) => {
    if (err) {
      console.log("Error Accured while trying to put staff...");
      return res.status(500).json(err);
    }
    console.log("Data were successfully updated");
    return res.status(200).json(data);
  });
};

const deleteStaff = (req, res, table, indentifier = "id") => {
  if (!req.params.id)
    return res.status(400).json({
      success: false,
      message: `You are not providing an ID, so there is no way to know what to delete...`,
    });

  const entityId = parseInt(req.params.id);
  const q = `DELETE FROM ${table} WHERE ${indentifier} = ?`;

  database.query(q, [entityId], (err, data) => {
    if (err) {
      console.log("Error Accured while trying to Delete Specific staff...");
      return res.status(500).json(err);
    }

    if (data.affectedRows === 0)
      return res.status(400).json({
        success: false,
        message: `The Element with ID: ${entityId}, does not exist, therefore can not be deleted.`,
      });

    console.log("Specific Data were successfully Deleted from DB");
    return res.status(200).json(data);
  });
};

const checkExistanceById = (req, res, table, indentifier = "id") => {
  const q = `SELECT EXISTS(SELECT * FROM ${table} WHERE ${indentifier}=${parseInt(
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

module.exports = {
  getStaff,
  postStaff,
  putStaff,
  deleteStaff,
  checkExistanceById,
};
