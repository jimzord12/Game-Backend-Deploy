// const bcrypt = require("bcrypt");
const crypto = require("crypto");
const util = require("util");
const controller = require("./TestingcontrollerTypeA");

// Convert pbkdf2 to a Promise-based function
const pbkdf2 = util.promisify(crypto.pbkdf2);

const handleNewUser = async (req, res) => {
  /* // Old Code
  const { name, password, wallet } = req.body;
  if (!name || !password || !wallet) {
    return res.status(400).json({
      message:
        "Express, RegisterController: Username, Wallet and Password are required.",
    });
  }
  */

  const { name, email, password, wallet } = req.body;
  if (!name || !password || !wallet || !email) {
    return res.status(400).json({
      message:
        "Express Server, RegisterController: Username, Wallet and Password are required.",
      requestBody: req.body,
    });
  }

  console.log("(registerController) - The Req Body: ", req.body);

  try {
    // Generate a new salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Use the pbkdf2 function to hash the password
    const hashedPwd = await pbkdf2(password, salt, 10000, 64, "sha512");

    // convert the hashed password to a readable format
    req.body.password = hashedPwd.toString("hex"); //12345678asf
    req.body.salt = salt;
    controller(req, res, "players", "post", [
      "name",
      "password",
      "salt",
      "wallet",
      "email",
    ]);

    /* // Old Code
    const hashedPwd = await bcrypt.hash(password, 10);
    req.body.password = hashedPwd;
    controller(req, res, "players", "post", ["name", "password", "wallet"]);
    */
  } catch (err) {
    console.log("The Error comes from: (registerController -> handleNewUser)");
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const handleNewPlayer = async (req, res) => {
  const { name, wallet } = req.body;
  if (!name || !wallet) {
    return res.status(400).json({
      message: "Express, RegisterController: Username, Wallet are required.",
    });
  }

  try {
    controller(req, res, "players", "post", ["name", "wallet"]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// For reseting the password see this: https://chat.openai.com/share/7315c332-31b2-4f2f-960c-314e09f96593

module.exports = { handleNewUser, handleNewPlayer };
