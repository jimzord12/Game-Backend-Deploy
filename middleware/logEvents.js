const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`; // Lib for easy Date creation
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      // checks if the directory for the logs exists
      await fsPromises.mkdir(path.join(__dirname, "..", "logs")); // if it doesn't exist, creates it
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    ); // creates the log
  } catch (err) {
    console.log(err);
  }
};

// the middleware that uses the logEvents
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt"); // just calls logEvents, to create a log file
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };
