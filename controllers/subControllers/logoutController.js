// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises = require('fs').promises;
// const path = require('path');
const database = require("../../model/database");

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken
  const { name } = req.body;
  console.log("Logout Request: ", req.body);

  const cookies = req.cookies;
  console.log("My Cookies: ", cookies);
  if (!cookies?.jwt)
    return res
      .status(204)
      .json({ message: "There are no JWT Cookies to remove" }); //No content
  const refreshToken = cookies.jwt;
  console.log(
    "My refreshToken: ",
    refreshToken.slice(refreshToken.length - 12, refreshToken.length)
  );

  // Is refreshToken in db?
  const q1 = `SELECT * FROM players WHERE name = '${name}'`;
  const q2 =
    "UPDATE players SET `refreshToken` = NULL WHERE `name` = " +
    "'" +
    name +
    "'";

  database.query(q1, async (err, data) => {
    console.log("=> ", data);
    if (err) {
      console.log("Error Accured while Clearing the Refresh Token Cookie...");
      return res.status(401).json(err);
    }
    console.log(
      "Do I have a refresh token in the DB? -> ",
      data[0]?.refreshToken?.length > 6
    );

    if (data[0]?.refreshToken?.length > 6) {
      console.log("1) Clearing the Refresh Token Cookie");
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      // return res.status(200).json({
      //   message: "User's Refresh Token Cookie has Successfully been Cleared",
      // });
    }

    database.query(q2, [refreshToken], async (err, data) => {
      if (err) {
        console.log(
          "Error Accured while Deleting the Refresh Token from the DB..."
        );
        return res.status(401).json(err);
      }

      if (data.affectedRows === 0)
        return res.status(400).json({
          success: false,
          message: `The Refresh Token: '${refreshToken.slice(
            refreshToken.length - 6,
            refreshToken.length
          )}', does not exist in the Database, therefore can not be deleted.`,
        });

      console.log("2) The Refresh Token was successfully Deleted from DB");
      return res.status(200).json(data);
    });
  });
};
//   if (!foundUser) {
//     res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
//     return res.sendStatus(204);
//   }

//   // Delete refreshToken in db
//   const otherUsers = usersDB.users.filter(
//     (person) => person.refreshToken !== foundUser.refreshToken
//   );
//   const currentUser = { ...foundUser, refreshToken: "" };
//   usersDB.setUsers([...otherUsers, currentUser]);
//   await fsPromises.writeFile(
//     path.join(__dirname, "..", "model", "users.json"),
//     JSON.stringify(usersDB.users)
//   );

//   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
//   res.sendStatus(204);
// };

module.exports = { handleLogout };
