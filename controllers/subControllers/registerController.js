// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require("bcrypt");
const controller = require("./TestingcontrollerTypeA");

const handleNewUser = async (req, res) => {
  const { name, password, wallet } = req.body;
  if (!name || !password || !wallet) {
    return res.status(400).json({
      message:
        "Express, RegisterController: Username, Wallet and Password are required.",
    });
  }
  // check for duplicate usernames in the db
  // const duplicate = usersDB.users.find(person => person.username === user);
  //   controller(req, res, "players", "get", "", "name");
  // if (duplicate) return res.sendStatus(409); //Conflict
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    req.body.password = hashedPwd;
    controller(req, res, "players", "post", ["name", "password", "wallet"]);

    //store the new user
    // const newUser = {
    //     "username": user,
    //     "roles": { "User": 2001 },
    //     "password": hashedPwd
    // };
    // usersDB.setUsers([...usersDB.users, newUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(usersDB.users)
    // );
    // console.log(usersDB.users);
    // res.status(201).json({ 'success': `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleNewPlayer = async (req, res) => {
  const { name, wallet } = req.body;
  if (!name || !wallet) {
    return res.status(400).json({
      message:
        "Express, RegisterController: Username, Wallet are required.",
    });
  }
  // check for duplicate usernames in the db
  // const duplicate = usersDB.users.find(person => person.username === user);
  //   controller(req, res, "players", "get", "", "name");
  // if (duplicate) return res.sendStatus(409); //Conflict
  try {
    //encrypt the password
    controller(req, res, "players", "post", ["name", "wallet"]);

    //store the new user
    // const newUser = {
    //     "username": user,
    //     "roles": { "User": 2001 },
    //     "password": hashedPwd
    // };
    // usersDB.setUsers([...usersDB.users, newUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(usersDB.users)
    // );
    // console.log(usersDB.users);
    // res.status(201).json({ 'success': `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser, handleNewPlayer };
