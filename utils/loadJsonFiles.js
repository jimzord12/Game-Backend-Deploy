// Function to load JSON files and return an array of JSON objects
const fs = require("fs");
const path = require("path");

function loadJsonFiles(directory) {
  console.log("loadJsonFiles Directory: ", directory);
  const filenames = fs.readdirSync(directory);
  const files = filenames.map((filename) => {
    const filePath = path.join(directory, filename);
    const fileContent = fs.readFileSync(filePath);
    return JSON.parse(fileContent);
  });
  return files;
}
module.exports = loadJsonFiles;
