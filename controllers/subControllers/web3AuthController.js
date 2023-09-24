const { verifySignature } = require("../../utils/web3Tools");

// const { handleLogin } = require("./authControllerNoPwd");

const web3Login = async (req, res) => {
  const { message, userAddress, signedMessage } = req.body;
  const verified = verifySignature(message, userAddress, signedMessage);
  if (verified) {
    return res.status(200).json({ verified });
  } else {
    return res.status(500).json({ verified });
  }
};

module.exports = { web3Login };
