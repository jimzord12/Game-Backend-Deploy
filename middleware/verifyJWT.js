const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; //  stores the authorization header
  //@Note: This is very baaaddd practise, I think...
  if (req.headers.newaccount) next();
  // if (req.headers.NewAccount)
  // console.log("Verifying Headers: ", req.headers);

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("Does NOT start with Bear...");
    return res.status(401).json({ message: "Does NOT start with Bear..." }); // if it does NOT start with 'Bearer ', send a bad staus code response
  }
  const token = authHeader.split(" ")[1]; // stores the jwt token (which is just a big string)

  // use the built-in method to validate the token
  jwt.verify(
    token, // the jwt token (big string)
    process.env.ACCESS_TOKEN_SECRET, // the secret Key (or Salt) used to encrypt & create the jwt token

    // The decoded, is the decoded data we get from the client's request
    (err, decoded) => {
      if (err) {
        console.log("The A-JWT is not valid: ", err);
        return res
          .status(403)
          .json({ message: "JWT Middleware: Error while verifying Token" });
      } //invalid token
      req.user = decoded.UserInfo.username; // the username the client sended
      // req.roles = decoded.UserInfo.roles; // the roles the client sended
      console.log("The token is Valid!");
      next();
    }
  );
};

module.exports = verifyJWT;
