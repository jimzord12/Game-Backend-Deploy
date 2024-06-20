const fs = require("fs");
const path = require("path");
const cronParser = require("cron-parser");

function generateTop10PlayersReport(top10Players) {
  console.log("Generating Top 10 Players Report");

  const currentDate = new Date();
  const interval = cronParser.parseExpression("0 18 15 * *");
  const nextExecution = interval.next().toDate();

  const report = {
    top10Players: top10Players,
    executedAt: currentDate,
    nextExecution: nextExecution,
  };

  const jsonString = JSON.stringify(report, null, 2);
  const filePath = path.join(__dirname, "../top10PlayersReport.json");

  fs.writeFile(filePath, jsonString, "utf8", (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Report generated successfully");
    }
  });
}

module.exports = generateTop10PlayersReport;
