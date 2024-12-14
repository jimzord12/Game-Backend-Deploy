const express = require("express");
const { urlencoded, json } = require("express");
const { join } = require("path");
const fs = require("fs").promises; // Use the promises API of the fs module
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
// const { logger } = require("./middleware/logEvents");
// const errorHandler = require("./middleware/errorHandler");
// const verifyJWT = require("./middleware/verifyJWT"); // ✨ Temporarily disabled for testing purposes ✨
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const cron = require("node-cron");
require("dotenv").config();

const { getBigRandomNumber } = require("./utils/web3Tools");
const database = require("./model/database");

// For Weekly MGS Awards
const sortBasedOnRank = require("./utils/sortBasedOnRank");
const { awardMGSTokens } = require("./utils/web3Tools");
const generateTop10PlayersReport = require("./utils/generateTop10PlayersReport");

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
// app.use(logger);

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
app.get("/randomNum", (req, res) => {
  const result = getBigRandomNumber();
  res.status(200).json({
    randNum: result,
  });
});
// The Below Route requires PASSWORDS
// app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/gasless", require("./routes/gasless")); // ⛽ <- Gasless Logic (ETH-related)
app.use("/logout", require("./routes/logout"));

// app.use(verifyJWT); // ✨ Temporarily disabled for testing purposes ✨

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
app.use("/quiz-questions", require("./routes/api/quizQuestions"));

// Web3 Routes
app.use("/web3", require("./routes/api/web3Handlers"));

// Google Form Routes
app.use("/google-form-submit", require("./routes/api/googleForm"));

// Workshops Routes
app.use("/workshops", require("./routes/api/workshops"));

// Top 10 Players Report
app.get("/top10-players-report", async (req, res) => {
  const filePath = path.join(__dirname, "top10PlayersReport.json");

  try {
    // Read the JSON file asynchronously
    const data = await fs.readFile(filePath, "utf8");
    const report = JSON.parse(data);

    // Check if report exists and send response
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Top 10 Players Report not found" });
    }
  } catch (err) {
    console.error("Error reading report file:", err);
    res.status(500).json({ message: "Error reading report file" });
  }
});

app.post("/create-top10-players-report", async (req, res) => {
  // Place your logic here
  const q =
    "SELECT `id`, `name`, `rank`, `wallet` FROM `genera-game-v3`.players;";
  database.query(q, async (err, data) => {
    if (err) {
      console.log("--|Error|CRON|DB ERROR: ", err);
    } else {
      console.log("======***======** MONTHLY - MGS AWARDS **======***======");
      // console.log("Data: ", data);
      const sortedPlayersArray = sortBasedOnRank(data);
      const top10Players = sortedPlayersArray.slice(0, 10); // TODO: Change this to 10
      console.table(
        top10Players.map((player, index) => ({
          No: index + 1,
          Name: player.name,
          Wallet: player.wallet,
          Rank: player.rank === null ? "N/A" : player.rank, // Displaying 'N/A' for null ranks
        }))
      );

      console.log("=================================================");

      const report = await generateTop10PlayersReport(top10Players);
      // const report = require("./top10PlayersReport.json");

      if (report) {
        console.log("=================================================");
        console.log("Top 10 Players Report:");
        console.log(report);
        console.log("=================================================");

        console.table(
          report.top10Players.map((player, index) => ({
            No: index + 1,
            Name: player.name,
            Wallet: player.wallet,
            Rank: player.rank === null ? "N/A" : player.rank, // Displaying 'N/A' for null ranks
          }))
        );
        console.log("=================================================");

        res.status(200).json({
          message: "Top 10 Players Report created successfully",
          report,
        });
      } else {
        res.status(404).json({ message: "Top 10 Players Report not found" });
      }
    }
  });
});

// Testing My Mini Library
// app.use("/testing", require("./routes/api/apiRouteTest"));

// app.use("/tables", require("./routes/tables"));
// app.use("/employees", require("./routes/api/employees"));
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

// Schedule WEEKLY MGS AWARDS to be run on the server.
cron.schedule(
  // TODO: MONTH
  "0 18 15 * *", // CRON expression for running at 6:00 PM on the 15th of every month
  // "*/20 * * * * *", // 🧪 Enable For testing runs every 10 secs
  function () {
    console.log("");
    console.log("Running a task every 15th of every Month at 6:00 PM GMT+0");

    // Place your logic here
    const q =
      "SELECT `id`, `name`, `rank`, `wallet` FROM `genera-game-v3`.players;";
    database.query(q, (err, data) => {
      if (err) {
        console.log("--|Error|CRON|DB ERROR: ", err);
      } else {
        console.log("======***======** MONTHLY - MGS AWARDS **======***======");
        // console.log("Data: ", data);
        const sortedPlayersArray = sortBasedOnRank(data);
        const top10Players = sortedPlayersArray.slice(0, 10); // TODO: Change this to 10
        console.table(
          top10Players.map((player, index) => ({
            No: index + 1,
            Name: player.name,
            Wallet: player.wallet,
            Rank: player.rank === null ? "N/A" : player.rank, // Displaying 'N/A' for null ranks
          }))
        );
        (async () => {
          for (const [index, player] of top10Players.entries()) {
            const reward = (top10Players.length - index) * 3;
            await awardMGSTokens(player.wallet, reward);
          }
        })();

        console.log("=================================================");

        generateTop10PlayersReport(top10Players);
      }
    });
  },
  {
    scheduled: true,
    timezone: "Etc/GMT",
  }
);

app.listen(process.env.PORT || PORT_LOCAL, () =>
  console.log(`Server running on port ${process.env.PORT || PORT_LOCAL}`)
);
