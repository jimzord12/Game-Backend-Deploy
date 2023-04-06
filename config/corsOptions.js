const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    console.log("These are the allowed origins: ", allowedOrigins);
    console.log("This Origin is trying to access: ", origin);
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log(
        "1 -> This Origin is trying to access: ",
        allowedOrigins.indexOf(origin) !== -1
      );
      console.log("2 -> This Origin is trying to access: ", !origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
