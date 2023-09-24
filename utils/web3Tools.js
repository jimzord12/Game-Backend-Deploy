const ethers = require("ethers");
const crypto = require("crypto");

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
    console.log("AAAAAAA: ", userAddress);

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

module.exports = { getBigRandomNumber, verifySignature, minifyAddress };
