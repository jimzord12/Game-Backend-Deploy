// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
const bcrypt = require("bcrypt");
const database = require("../../model/database");

const jwt = require("jsonwebtoken");
require("dotenv").config();
// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogin = async (req, res) => {
  const { name, password } = req.body;
  console.log("AuthController, Request Body: ", req.body);
  if (!name || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // controller(req, res, "players", "post", ["name", "password"]);
  const q = `SELECT * FROM players WHERE name = '${name}'`;
  //   const q1 = `SELECT * FROM players WHERE name = '${name}' AND password = '${password}'`;

  database.query(q, async (err, data) => {
    if (err) {
      console.log(err);
      console.log("Error Accured while Autheticating User...");
      return res.status(401).json(err);
    }
    console.log(`Retrieved <${name}> Password: ${data}`);
    if (data.length === 0)
      return res.status(401).json(`The User: ${name}, is not registered!`);

    const pwdMatch = await bcrypt.compare(password, data[0].password);
    if (pwdMatch) {
      console.log("AuthController: Passwords Match!");

      // Creating Access Token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: data[0].name,
            wallet: data[0].wallet,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30m" }
      );
      console.log(
        "Created Access Token (12-lastDigits): ",
        accessToken.slice(accessToken.length - 12, accessToken.length)
      );

      // Creating Refresh Token
      const refreshToken = jwt.sign(
        {
          UserInfo: {
            username: data[0].name,
            wallet: data[0].wallet,
          },
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      console.log(
        "Created Refresh Token (12-lastDigits): ",
        refreshToken.slice(refreshToken.length - 12, refreshToken.length)
      );

      const q =
        "UPDATE players SET `refreshToken` = ? WHERE `name` = " +
        "'" +
        data[0].name +
        "'";

      database.query(q, [refreshToken], async (err, data2) => {
        if (err) {
          console.log("Error Accured while Adding Refresh Token to DB...");
          return res.status(401).json(err);
        }
        console.log(
          "Refresh Token Successfully Added to Database",
          data2.affectedRows > 0 ? true : false
        );
        console.log("Cookie Containing Refresh Token was sent Successfully");

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          rT: refreshToken,
          aT: accessToken,
          wallet: data[0].wallet,
        });
      });
    }
  });

  //   const foundUser = usersDB.users.find((person) => person.username === name);
  //   if (!foundUser) return res.sendStatus(401); //Unauthorized
  //   // evaluate password
  //   const match = await bcrypt.compare(password, foundUser.password);
  //   if (match) {
  //     const roles = Object.values(foundUser.roles);
  //     // create JWTs
  //     const accessToken = jwt.sign(
  //       {
  //         UserInfo: {
  //           username: foundUser.username,
  //           roles: roles,
  //         },
  //       },
  //       process.env.ACCESS_TOKEN_SECRET,
  //       { expiresIn: "30s" }
  //     );
  //     const refreshToken = jwt.sign(
  //       { username: foundUser.username },
  //       process.env.REFRESH_TOKEN_SECRET,
  //       { expiresIn: "1d" }
  //     );
  //     // Saving refreshToken with current user
  //     const otherUsers = usersDB.users.filter(
  //       (person) => person.username !== foundUser.username
  //     );
  //     const currentUser = { ...foundUser, refreshToken };
  //     usersDB.setUsers([...otherUsers, currentUser]);
  //     await fsPromises.writeFile(
  //       path.join(__dirname, "..", "model", "users.json"),
  //       JSON.stringify(usersDB.users)
  //     );
  //     res.cookie("jwt", refreshToken, {
  //       httpOnly: true,
  //       sameSite: "None",
  //       secure: true,
  //       maxAge: 24 * 60 * 60 * 1000,
  //     });
  //     res.json({ accessToken });
  //   } else {
  //     res.sendStatus(401);
  //   }
};

module.exports = { handleLogin };
