const express = require("express");

const database = require("../model/database");
const web3Tools = require("../utils/web3Tools");

const router = express.Router();

const handleRegister = async (req, res) => {
  const { address } = req.body;
  try {
    const hasEnoughETH = await web3Tools.checkUserBalance(address);
    console.log("Gasless: hasEnoughETH: ", hasEnoughETH);
    if (hasEnoughETH) {
      res.status(200).json({ message: "User sufficient ETH balance" });
      return;
    }

    const tx = await web3Tools.sendEth(address);
    res.status(200).json({ success: true, tx });
  } catch (error) {
    console.log("Failed to Send ETH to the freshly Registered Player");
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleLogin = async (req, res) => {
  const { address } = req.body;
  console.log("- Retrieved Address: ", address);
  try {
    // Has Enough ETH to play the Game?
    const hasEnoughETH = await web3Tools.checkUserBalance(address);
    console.log("Gasless: hasEnoughETH: ", hasEnoughETH);
    if (hasEnoughETH) {
      res.status(200).json({ message: "User sufficient ETH balance" });
      return;
    }
    // Guard against ETH request spamming
    const cooldownPassed = await web3Tools.checkLastTransferDate(
      address,
      database
    );
    console.log("Gasless: cooldownPassed: ", cooldownPassed);
    if (cooldownPassed) {
      const result = await web3Tools.sendEthAndUpdateDate(address, database);

      if (result.success === true) {
        res
          .status(200)
          .json({ success: true, message: "User got 0.5 ETH", tx: result.tx });
      }
    } else {
      console.log(
        "The Cooldown for the re-sent of 0.5 ETH has not yet passed. Try again later."
      );

      res.status(500).json({
        success: false,
        message:
          "The Cooldown for the re-sent of 0.5 ETH has not yet passed. Try again later.",
      });
    }
  } catch (error) {
    console.log("Failed to Send ETH to the Player upon Login");
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post("/register", handleRegister);
router.post("/login", handleLogin);

module.exports = router;
