const express = require("express");
const { urlencoded, json } = require("express");
const { join } = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
require("dotenv").config();

// Importing using -> ES6 Modules (also known as, ESM)
// import { join } from "path";
// import cors from "cors";
// import corsOptions from "./config/corsOptions";
// import { logger } from "./middleware/logEvents";
// import errorHandler from "./middleware/errorHandler";
// import verifyJWT from "./middleware/verifyJWT";
// import cookieParser from "cookie-parser";
// import credentials from "./middleware/credentials";

const app = express();
const PORT_LOCAL = /*process.env.PORT || */ 3500;

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(urlencoded({ extended: false }));

// built-in middleware for json
app.use(json());

//middleware for cookies
app.use(cookieParser());

//serve static files
// TODO: Uncomment This when 404 page is created!
// app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use("/", require("./routes/root"));
// app.use("/tables", require("./routes/tables"));
app.use("/register", require("./routes/register"));
app.use("/authNoPwd", require("./routes/authNoPwd"));
// The Below Route requires PASSWORDS
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
// sub-routes
app.use("/players", require("./routes/api/players"));
app.use("/marketplace", require("./routes/api/marketplace"));
app.use("/player-cards", require("./routes/api/playerCards"));
app.use("/cards", require("./routes/api/cards"));
app.use("/card-templates", require("./routes/api/cardTemplates"));
app.use("/card-stats", require("./routes/api/cardStats"));
app.use("/achievements", require("./routes/api/achievements"));
app.use("/achiev-templates", require("./routes/api/achievTemplates"));
app.use("/alliances", require("./routes/api/alliances"));
app.use("/subjects", require("./routes/api/subjects"));
app.use("/leaderboard-al", require("./routes/api/leaderboardAl"));
app.use("/leaderboard-pl", require("./routes/api/leaderboardPl"));
app.use("/towns", require("./routes/api/towns"));
app.use("/islands", require("./routes/api/islands"));
app.use("/latest-id", require("./routes/api/latestId"));

// Testing My Mini Library
app.use("/testing", require("./routes/api/apiRouteTest"));

app.use("/tables", require("./routes/tables"));
app.use("/employees", require("./routes/api/employees"));
// app.use("/auth", require("./routes/auth"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    // eslint-disable-next-line no-undef
    res.sendFile(join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(process.env.PORT || PORT_LOCAL, () =>
  console.log(`Server running on port ${process.env.PORT || PORT_LOCAL}`)
);
