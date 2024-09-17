// utils/generateTop10PlayersReport.js

const fs = require("fs").promises; // Use the promises API of the fs module
const path = require("path");
const cronParser = require("cron-parser");

/**
 * Generates a Top 10 Players Report and writes it to a JSON file asynchronously.
 *
 * @param {Array} top10Players - An array of the top 10 player objects.
 * @returns {Object} The generated report object.
 */
async function generateTop10PlayersReport(top10Players) {
  console.log("Generating Top 10 Players Report");

  // Capture the current date and calculate the next execution time based on the cron expression
  const currentDate = new Date();
  const interval = cronParser.parseExpression("0 18 15 * *");
  const nextExecution = interval.next().toDate();

  // Construct the report object
  const report = {
    top10Players: top10Players,
    executedAt: currentDate,
    nextExecution: nextExecution,
  };

  // Convert the report object to a JSON string with pretty formatting
  const jsonString = JSON.stringify(report, null, 2);

  // Define the file path relative to the current module's directory
  const filePath = path.join(__dirname, "../top10PlayersReport.json");

  try {
    // Asynchronously write the JSON string to the specified file path
    await fs.writeFile(filePath, jsonString, "utf8");
    console.log("Report generated successfully");
  } catch (err) {
    // Handle any errors that occur during the file write operation
    console.error("Error writing file:", err);
  }

  // Return the report object for further use if needed
  return report;
}

module.exports = generateTop10PlayersReport;
