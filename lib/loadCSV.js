const fs = require("fs");
const CSVToArray = require("./CSVToArray");
const CSVParser = require("./CSVParser");

module.exports = function loadCSV(path) {
	return fs.readFileAsync(path, "utf8")
	.then(CSVToArray)
	.then(CSVParser);
};
