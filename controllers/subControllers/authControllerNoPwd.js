// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
// const bcrypt = require("bcrypt");
const database = require("../../model/database");
const { minifyAddress } = require("../../utils/web3Tools");

const jwt = require("jsonwebtoken");
require("dotenv").config();
// const fsPromises = require('fs').promises;
// const path = require('path');

const walletRegex = /^0x[a-fA-F0-9]{40}$/;
const nameRegex = /^[a-zA-Z][a-zA-Z0-9 ]*$/;

// Requires USERNAME
// Returns :
// {
//   rT: refreshToken,
//   aT: accessToken,
//   wallet: data[0].wallet,
// }

const handleLogin2 = async (req, res) => {
  const { walletAddress } = req.body;
  // console.log(
  //   "(handleLogin2): AuthController (NoPWD), Request Body: ",
  //   req.body
  // );
  const isPlayerWallet = walletRegex.test(walletAddress);
  const queryIdentifier = isPlayerWallet ? "wallet" : "";

  if (!walletAddress)
    return res.status(400).json({ message: "Wallet is required." });
  if (queryIdentifier === "") {
    return res.status(400).json({ message: "Invalid player wallet address." });
  }

  // controller(req, res, "players", "post", ["name", "password"]);
  const q = `SELECT * FROM players WHERE ${queryIdentifier} = '${walletAddress}'`;

  database.query(q, async (err, data) => {
    if (err) {
      console.log("Error Accured while Autheticating User...");
      if (err.code === "ECONNREFUSED") {
        console.log("|BAD| - You Probably have a Database Connection Error...");
        console.log("-------------------------------------------");
        console.log(err);
        return res
          .status(500)
          .json({ error: "Database connection was refused." });
      }
      console.log(err);
      return res.status(401).json(err);
    }
    // console.log("The Data from DB, conserning this Wallet: ", walletAddress);
    // console.log();
    // console.log(data);
    if (
      data.length === 0 ||
      data[0].name === "" ||
      data[0].name === "Milk Cookies"
    )
      return res
        .status(401)
        .json(`The User: ${minifyAddress(walletAddress)}, is not registered!`);

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
    // console.log(
    //   "Created Access Token (12-lastDigits): ",
    //   accessToken.slice(accessToken.length - 12, accessToken.length)
    // );

    // Creating Refresh Token
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          username: data[0].name.substring(0, 20),
          wallet: data[0].wallet.substring(0, 20),
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // console.log(
    //   "Created Refresh Token (12-lastDigits): ",
    //   refreshToken.slice(refreshToken.length - 12, refreshToken.length)
    // );

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

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log("Cookie Containing Refresh Token was sent Successfully");

      return res.status(200).json({
        rT: refreshToken,
        aT: accessToken,
        wallet: data[0].wallet,
        username: data[0].name,
      });
    });
  });
};

const handleLogin = async (req, res) => {
  const { name: username } = req.body;
  console.log("AuthController (NoPWD), Request Body: ", req.body);
  const isPlayerName = nameRegex.test(username);
  const isPlayerWallet = walletRegex.test(username);
  const queryIdentifier = isPlayerName
    ? "name"
    : isPlayerWallet
    ? "wallet"
    : "";

  if (!username)
    return res.status(400).json({ message: "Username is required." });
  if (queryIdentifier === "") {
    return res
      .status(400)
      .json({ message: "Invalid player name/wallet address." });
  }
  // if (!isPlayerName && !isPlayerWallet) {
  //   return res
  //     .status(400)
  //     .json({ message: "Invalid wallet address or wrong player name." });
  // }
  // else {
  //   if (!isPlayerName) {
  //     console.log("The username is probably a wallet address...");
  //     if (!isPlayerWallet) {
  //       return res.status(400).json({ message: "Invalid wallet address." });
  //     } else {
  //       return res.status(400).json({ message: "Invalid player name." });
  //     }
  //   }
  // }

  // controller(req, res, "players", "post", ["name", "password"]);
  const q = `SELECT * FROM players WHERE ${queryIdentifier} = '${username}'`;
  //   const q1 = `SELECT * FROM players WHERE name = '${name}' AND password = '${password}'`;

  database.query(q, async (err, data) => {
    if (err) {
      // console.log(err);
      // console.log("Error Accured while Autheticating User...");
      return res.status(401).json(err);
    }
    if (data.length === 0)
      return res.status(401).json(`The User: ${username}, is not registered!`);

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
    // console.log(
    //   "Created Access Token (12-lastDigits): ",
    //   accessToken.slice(accessToken.length - 12, accessToken.length)
    // );

    // Creating Refresh Token
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          username: data[0].name.substring(0, 20),
          wallet: data[0].wallet.substring(0, 20),
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // console.log(
    //   "Created Refresh Token (12-lastDigits): ",
    //   refreshToken.slice(refreshToken.length - 12, refreshToken.length)
    // );

    const q =
      "UPDATE players SET `refreshToken` = ? WHERE `name` = " +
      "'" +
      data[0].name +
      "'";

    database.query(q, [refreshToken], async (err) => {
      if (err) {
        // console.log("Error Accured while Adding Refresh Token to DB...");
        return res.status(401).json(err);
      }
      // console.log(
      //   "Refresh Token Successfully Added to Database",
      //   data2.affectedRows > 0 ? true : false
      // );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      console.log("Cookie Containing Refresh Token was sent Successfully");

      return res.status(200).json({
        rT: refreshToken,
        aT: accessToken,
        wallet: data[0].wallet,
      });
    });
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

module.exports = { handleLogin, handleLogin2 };
