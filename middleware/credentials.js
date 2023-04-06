const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin; // stores the origin of the request

  if (allowedOrigins.includes(origin)) {
    // if the origin is allowed

    res.header("Access-Control-Allow-Credentials", true); // enables credentials to the response header
  }
  next(); // do not disrupt the proceeding middleware
};

module.exports = credentials;
