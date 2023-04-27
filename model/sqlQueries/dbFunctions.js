const database = require("../database");

const getStaff = (req, res, table, indentifier, select = "*", specialCase) => {
  let q = "";

  if (specialCase === "AllCardsAndStats") {
    const entity = req.params[indentifier];

    q = `SELECT ${select}
    FROM ${table}
    INNER JOIN players ON cards.ownerId = players.id
    INNER JOIN card_stats ON cards.id = card_stats.cardId
    WHERE players.id = ${entity}`;

    database.query(q, [entity], (err, data) => {
      console.log("The Query: ", q);
      if (err) {
        console.log(
          "(CustomError): Error Accured while trying to get All the Player's Cards and their Stats..."
        );
        return res.status(500).json(err);
      }
      console.log(
        "All Player's Cards and their Stats were successfully retrieved from DB"
      );
      console.log(data);
      return res.status(200).json(data);
    });
  } else {
    if (!indentifier || indentifier === "_") {
      q = `SELECT ${select} FROM ${table}`;
    } else {
      // const entityId = req.params.id;
      q = `SELECT ${select} FROM ${table} WHERE ${indentifier} = ?`;
      // database.query(q, [entityId], (err, data) => {
      //   if (err) {
      //     console.log("Error Accured while trying to get Specific staff...");
      //     return res.status(500).json(err);
      //   }

      //   if (data.length === 0) {
      //     // If data is a falsy value, in this case an empty Array
      //     const customError = new Error(
      //       `The Requested '${table.slice(
      //         0,
      //         -1
      //       )}', with ID: '${entityId}' does not exists!`
      //     );
      //     console.log(customError);
      //     return res.status(404).json(customError.message);
      //   }

      //   console.log("Specific Data were successfully retrieved from DB");
      //   return res.status(200).json(data);
      // });
    }

    console.log(q);

    database.query(q, (err, data) => {
      if (err) {
        console.log("Error Accured while trying to get staff...");
        return res.status(500).json(err);
      }
      console.log("Data were successfully retrieved from DB");
      return res.status(200).json(data);
    });
  }
};

const getSpecificStaff = (req, res, table, indentifier = "id", value) => {
  let entityId;
  if (indentifier.includes("Id") || indentifier.includes("id")) {
    entityId = req.params.id;
  } else {
    entityId = req.params[indentifier];
  }

  // indentifier === "id"
  //   ? req.params.id
  //   : indentifier === "wallet"
  //   ? req.params.wallet
  //   : req.params.name;
  console.log("The Decoded Params ARE: ", req.params);
  console.log("The Decoded Params from request was: ", entityId);
  // console.log("The Params from request was: " + entityId);
  console.log("The Indentifier from request was: " + indentifier);
  let q = `SELECT * FROM ${table} WHERE ${indentifier} = ${
    value ? value : "?"
  }`;
  database.query(q, [entityId], (err, data) => {
    console.log("getSpecificStaff - SQL Query: ", q);
    if (err) {
      console.log("Error Accured while trying to get Specific staff...");
      return res.status(500).json(err);
    }

    if (data.length === 0 && value === undefined) {
      // If data is a falsy value, in this case an empty Array
      const customError = new Error(
        `The Requested '${table.slice(
          0,
          -1
        )}', using the Identifier (${indentifier}): '${entityId}' does not exists!`
      );
      console.log(customError);
      return res.status(404).json(customError.message);
    }
    console.log("Specific Data were successfully retrieved from DB");
    return res.status(200).json(data);
  });
};

// @param {string | String[]} to
// @param {String[]} (Optional) requiredFields
const postStaff = (req, res, to, requiredFields) => {
  let q = "";
  const quote = "`";
  let values = [];
  let sqlProps = [];
  let lastElement = "";

  console.log("THE REQUEST BODY: ", req.body);

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      success: false,
      message: `How do you expect to update anything, if you do not provide data?! 😤`,
    });

  if (
    requiredFields &&
    Array.isArray(requiredFields) &&
    requiredFields.length > 0
  ) {
    for (const reqField of requiredFields) {
      if (!Object.keys(req.body).includes(reqField)) {
        if (requiredFields.length > 2) {
          lastElement = requiredFields.pop();
          return res.status(400).json({
            message: `The following fields are required: ${requiredFields.join(
              ", "
            )} and ${lastElement}`,
            success: false,
          });
        }

        if (requiredFields.length === 2) {
          // lastElement = requiredFields.pop();
          return res.status(400).json({
            message: `The following fields are required: ${requiredFields[0]}, ${requiredFields[1]}.`,
            success: false,
          });
        }

        return res.status(400).json({
          message: `The following fields are required: ${requiredFields.toString()}.`,
          success: false,
        });
      }
    }
    // }
  }

  for (const [key, value] of Object.entries(req.body)) {
    const sqlKey = quote + key + quote;
    sqlProps.push(sqlKey);
    values.push(value);
  }
  //if it's an Array -> create Query for
  if (typeof to === "string") {
    q = `INSERT INTO ${to} (${[...sqlProps]}) VALUES (?)`;
    console.log("DB Functions -> PostStaff SQL Query: ", q);
  }

  //if it's an String
  if (Array.isArray(to)) {
    q = `INSERT INTO ${to} (${quote + to + quote}) VALUES (?)`;
    console.log("DB Functions -> PostStaff SQL Query: ", q);
  }

  database.query(q, [values], (err, results) => {
    if (err) {
      console.log("Error Accured while trying to post staff...", err);
      return res.status(500).json(err);
    }
    console.log("New Data were successfully saved to DB");
    console.log(">>> New Data: ", results);

    return res.status(201).json({ ...results[0], id: results.insertId });
    // database.query("SELECT LAST_INSERT_ID() AS id", (err, idResult) => {
    //   if (err) {
    //     console.log("Error Accured while trying to get last insert ID...", err);
    //     return res.status(500).json(err);
    //   }
    //   console.log(">>> Last Inserted ID: ", idResult[0].id);
    //   return res.status(201).json({ ...results, id: idResult[0].id });
    // });
  });
};

const putStaff = (req, res, to, requiredFields, indentifier = "id") => {
  const entityId = parseInt(req.params.id);
  let values = [];
  let sqlProps = [];
  let q = "";
  const quote = "`";

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({
      success: false,
      message: `How do you expect to update anything, if you do not provide data?! 😤`,
    });

  if (
    requiredFields &&
    Array.isArray(requiredFields) &&
    requiredFields.length > 0
  ) {
    // Now we know we have an Array that has at least one required field
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!req.body[`${requiredFields[i]}`])
        return res.status(400).json({
          success: false,
          message: `These fields are required: ${[...requiredFields]}`,
        });
    }
  }

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
    console.log("The Response Data: ", data);
    return res.status(200).json(data);
  });
};

const deleteStaff = (req, res, table, indentifier = "id") => {
  console.log(" ++++++++++++++++++++++++++ ");
  console.log("Indentifier: ", indentifier);
  console.log("req.body: ", req.body);
  console.log("Is this True? : ", Object.keys(req.body).length === 0);
  console.log(" ++++++++++++++++++++++++++ ");
  if (!req.params.id && Object.keys(req.body).length === 0)
    return res.status(400).json({
      success: false,
      message: `You are not providing an ID or Data, so there is no way to know what to delete...`,
    });

  let entityId;
  if (req.params.id === undefined) {
    entityId = req.body[indentifier];
  } else {
    entityId = parseInt(req.params.id);
  }

  const q = `DELETE FROM ${table} WHERE ${indentifier} = ?`;
  console.log(" SQL Query: ", q);
  console.log(" ++++++++++++++++++++++++++ ");

  database.query(q, [entityId], (err, data) => {
    if (err) {
      console.log("Error Accured while trying to Delete Specific staff...");
      return res.status(500).json(err);
    }
    console.log("DDDDD: ", data);
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
  // const entityId = parseInt(req.params.id);
  // let values = [];
  // let sqlProps = [];
  // let q = "";
  // const quote = "'";
  // // q = `UPDATE ${players} SET $'name' = ?, 'wallet' = ? WHERE id = ?`;
  // for (const [key, value] of Object.entries(req.body)) {
  //   const sqlKey = quote + key + quote + " =" + " ?";
  //   sqlProps.push(sqlKey);
  //   values.push(value);
  // }
  // q = `DELETE FROM ${table} WHERE id = ?`;
  // console.log("DB Functions -> DeleteStaff SQL Query: ", q);

  // database.query(q, [entityId], (err, data) => {
  //   if (err) {
  //     console.log("Error Accured while trying to delete staff...");
  //     return res.status(500).json(err);
  //   }
  //   console.log("Selected Data successfully deleted from DB");
  //   return res.status(200).json(data);
  // });
};

function throwError(req, res) {
  return res.status(400).json({
    message: "This Route does not exist!",
  });
}

function getEverything(req, res, table, Identifier) {
  {
    const username = req.params[Identifier];
    console.log(Identifier);
    console.log(username);

    // Query 1: Get player's data using the username
    database.query(
      `SELECT * FROM players WHERE ${Identifier} = ?`,
      [username],
      (err, playerData) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (playerData.length === 0) {
          return res.status(404).json({ error: "Player not found" });
        }

        const playerId = playerData[0].id;
        console.log(">> 1. Player ID: ", playerId);

        // In the case of a new player!!!
        if (
          playerData[0].island_id === null &&
          playerData[0].timestamp === null &&
          playerData[0].population === null
        ) {
          return res
            .status(200)
            .json({ player: playerData[0], isNewPlayer: true });
        }

        // Query 2: Get player's cards using the player's ID
        database.query(
          "SELECT * FROM cards WHERE ownerId = ?",
          [playerId],
          (err, cardsData) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            if (cardsData.length === 0)
              return res.status(200).json({
                player: playerData[0],
                cards: [],
                message: "Player has no Cards",
              });

            // Get all card IDs to fetch their stats
            const cardIds = cardsData.map((card) => card.id);
            console.log(">> 2. Card IDs: ", cardIds);

            // Get placeholders for the IN clause based on the length of the cardIds array
            const placeholders = cardIds.map(() => "?").join(",");

            // Query 3: Get stats for each of the cards
            database.query(
              `SELECT * FROM card_stats WHERE cardId IN (${placeholders})`,
              cardIds,
              (err, cardStatsData) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }

                // Combine cards data with their corresponding stats
                console.log(">>> THE cardStats : ", cardStatsData);
                const combinedData = cardsData.map((card) => {
                  const cardStats = cardStatsData.find(
                    (stats) => stats.cardId === card.id
                  );
                  return { ...card, stats: cardStats };
                });

                // Return the final result
                return res.status(201).json({
                  player: playerData[0],
                  cards: combinedData,
                });
              }
            );
          }
        );
      }
    );
  }
}

// const convertToCardFormat = (card, stats) => {
//   const techstoreStats = ["gold", "concrete", "metals", "crystals"];
//   // const techstoreStats = ["gold", "concrete", "metals", "crystals"];
//   const resultingStats = {};

//   if (card.templateId === 13) {
//     for (const stat in stats) {
//       if (Object.hasOwnProperty.call(stats, stat)) {
//         if (techstoreStats.includes(stat))
//           resultingStats[`${stat}ToolLvl`] = stats[stat];
//       }
//     }
//     console.log("The formatted Stats: ", resultingStats);
//     return resultingStats;
//   } else {
//     console.log("The formatted Stats: ", resultingStats);
//     return stats;
//   }
// };

module.exports = {
  getStaff,
  postStaff,
  putStaff,
  deleteStaff,
  getSpecificStaff,
  checkExistanceById,
  throwError,
  getEverything,
  // getAllTables,
};
