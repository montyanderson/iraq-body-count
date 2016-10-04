const fs = require("fs");
const loadCSV = require("./loadCSV");

module.exports = function icbData() {
	return Promise.all([
		loadCSV(__dirname + "/../data/ibc-incidents"),
		loadCSV(__dirname + "/../data/ibc-individuals")
	]).then(a => {
		const [ incidents, individuals ] = a;
		return { incidents, individuals };
	});
};
