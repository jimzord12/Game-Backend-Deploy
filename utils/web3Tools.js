const ethers = require("ethers");
const crypto = require("crypto");

const { MGSContractABI } = require("../constants/web3Constants");

// Initializing the provider at the top level
const provider = new ethers.providers.StaticJsonRpcProvider(
  "https://snf-34965.ok-kno.grnetcloud.net"
);

(async () => {
  console.log(
    "The Game's WS Address: 0x63bCA1067C3A4D334031cFec9E27F5A366072eED"
  );
  try {
    const balance = await provider.getBalance(
      "0x63bCA1067C3A4D334031cFec9E27F5A366072eED"
    );
    console.log(
      "The Game's WS Balance: ",
      ethers.utils.formatEther(balance),
      "ETH"
    );
  } catch (error) {
    console.error("Failed to fetch balance:", error.message);
  }
})();

// const database = require("../model/database");

const getBigRandomNumber = () => {
  console.log("-------------------------------------");
  console.log();
  console.log("Generating Big Random Number...");
  console.log();
  try {
    const randomBigNumber = crypto.randomInt(100000000, 999999999);
    // const randomBigNumber2 = crypto.randomInt(100000000000, 999999999999);
    console.log("The Random Number: ", randomBigNumber);
    console.log();
    console.log("-------------------------------------");
    console.log();

    return randomBigNumber;
  } catch (error) {
    console.error(
      "Error (Express | getBigRandomNumber()): Something went wrong while generating a random number",
      error.message
    );
  }
};

const verifySignature = (message, userAddress, signedMessage) => {
  console.log("-------------------------------------");
  console.log();
  console.log("***  SIGNATURE VERIFICATION  ***");
  console.log();
  console.log("The Retrieved Data: ", { message, userAddress, signedMessage });

  console.log();
  console.log("Hashing the Message...");
  console.log();
  console.log("-------------------------------------");

  try {
    const messageHash = ethers.utils.hashMessage(message);
    const recoveredAddress = ethers.utils.recoverAddress(
      messageHash,
      signedMessage
    );
    console.log("The Derived Address: ", recoveredAddress);
    console.log("Type of Derived Address: ", typeof recoveredAddress);
    // console.log("AAAAAAA: ", userAddress);

    if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
      console.log("Signature Verification - Success");
      return true;
    } else {
      console.log("Signature Verification - Failure");
      return false;
    }
  } catch (error) {
    console.error("Error during signature verification:", error.message);
    return false;
  }
};

function minifyAddress(address) {
  if (!address || address.length !== 42 || !address.startsWith("0x")) {
    throw new Error("Invalid Ethereum address");
  }

  const prefix = address.substring(0, 6); // "0x" + first 4 characters
  const suffix = address.substring(-4); // Last 4 characters

  return `${prefix}...${suffix}`;
}

async function checkUserBalance(userAddress) {
  const balance = await provider.getBalance(userAddress);
  const ethBalance = ethers.utils.formatEther(balance);

  return parseFloat(ethBalance) > 0.005;
}

function checkLastTransferDate(userAddress, database) {
  return new Promise((resolve, reject) => {
    const q = `SELECT lastETHtransfer FROM players WHERE wallet = ?`;
    database.query(q, [userAddress], (err, data) => {
      if (err) return reject(err);

      const now = new Date();
      console.log("Web3 - RAW Date: ", data[0]);
      if (data[0] === undefined) {
        reject(new Error("User not found"));
        return;
      }
      const lastTransferDate = new Date(data[0].lastETHtransfer);
      // console.log("Web3 - Date: ", lastTransferDate);
      const diffInHours = (now - lastTransferDate) / (1000 * 60 * 60);
      // console.log("Web3 - diffInHours: ", diffInHours);
      // console.log("Web3 - Result: ", diffInHours < 24);

      if (diffInHours < 24) {
        reject(new Error("Transfer already made in the last 24 hours"));
        return;
      } else {
        resolve(true);
      }
    });
  });
}

async function sendEthAndUpdateDate(userAddress, database) {
  try {
    // Sending the ETH
    const amount = ethers.utils.parseEther("0.5"); // 0.5 ETH
    const wallet = new ethers.Wallet(process.env.WS_PRIVATE_KEY, provider);
    const tx = await wallet.sendTransaction({
      to: userAddress,
      value: amount,
    });

    // Updating the database after the transaction is successful
    const q = `UPDATE players SET lastETHtransfer = NOW() WHERE wallet = ?`;
    database.query(q, [userAddress], (err) => {
      if (err) throw err; // This will be caught by the outer try-catch
    });
    console.log("=== TX - (sendEthAndUpdateDate) ===");
    console.log(tx);
    return { success: true, tx }; // Return true or any other confirmation of success if you want to
  } catch (error) {
    console.error("Error in sendEthAndUpdateDate:", error.message);
    throw error; // Propagate the error so that it can be handled by callers or middleware
  }
}

async function sendEth(userAddress) {
  const amount = ethers.utils.parseEther("0.5"); // 0.5 ETH
  const wallet = new ethers.Wallet(process.env.WS_PRIVATE_KEY, provider);
  const tx = await wallet.sendTransaction({
    to: userAddress,
    value: amount,
  });
  console.log("=== TX ===");
  console.log(tx);
  return tx;
}

async function awardMGSTokens(userAddress, amount) {
  console.log("=== AWARDING MGS ===");
  console.log("=====> User Address: ", userAddress);
  console.log("=====> Amount: ", amount);

  const signer = new ethers.Wallet(process.env.WS_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    process.env.MGS_CONTRACT_ADDRESS,
    MGSContractABI,
    signer
  );

  try {
    console.log("=====> Starting Tx...");
    const amount = ethers.utils.parseEther(amount.toString());
    await contract.giveTokensToUser(userAddress, amount);
    console.log("=====> Tx Successful!");
    return true;
  } catch (error) {
    console.log("-(!!)- [Error]: in awardMGSTokens:", error.message);
    return false;
  }
}

async function getMGSBalance(userAddress) {
  const signer = new ethers.Wallet(process.env.WS_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    process.env.MGS_CONTRACT_ADDRESS,
    MGSContractABI,
    signer
  );
  const balance = await contract.balanceOf(userAddress);
  const ethBalance = ethers.utils.formatEther(balance);

  return ethBalance;
}

module.exports = {
  getBigRandomNumber,
  verifySignature,
  minifyAddress,
  checkUserBalance,
  checkLastTransferDate,
  sendEthAndUpdateDate,
  sendEth,
  awardMGSTokens,
  getMGSBalance,
};
