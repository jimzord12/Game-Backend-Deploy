const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    const isAllowed = allowedOrigins.indexOf(origin) === -1 ? false : true;
    console.log("This Origin is trying to access: ", origin);
    if (isAllowed || !origin) {
      console.log("Checking if the origin is allowed: ", isAllowed);
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
