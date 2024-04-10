const express = require("express");
const router = express.Router();

const { awardMGSTokens, getMGSBalance } = require("../../utils/web3Tools.js");

router.route("/awardMGS").post(async (req, res) => {
  const userAddress = req.body.userAddress;
  const amount = req.body.amount;

  if (!userAddress || !amount) {
    res.status(400).json({ message: "Missing Parameters" });
  }

  const success = await awardMGSTokens(userAddress, amount);

  if (success) {
    res.status(200).json({ success: true });
  } else {
    res.status(500).json({
      success: false,
      message: "for error details, see the web server's terminal",
    });
  }
});

router.route("/getMGSBalance").post(async (req, res) => {
  console.log(" ---> The Request Body: ", req.body);

  const userAddress = req.body.userAddress;

  if (!userAddress) {
    res.status(400).json({ message: "Missing Parameters" });
    return;
  }

  try {
    const newBalance = await getMGSBalance(userAddress);
    console.log(" ===> New Balance: ", newBalance);
    res.status(200).json({ success: true, balance: newBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
