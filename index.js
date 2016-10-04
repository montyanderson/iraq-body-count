const bluebird = require("bluebird");
const fs = require("fs");

bluebird.promisifyAll(fs);
global.Promise = bluebird;

const CSVToArray = require("./lib/CSVToArray.js");
const CSVParser = require("./lib/CSVParser.js");

Promise.all([
	fs.readFileAsync(__dirname + "/data/ibc-incidents", "utf8")
	.then(CSVToArray)
	.then(CSVParser),
	fs.readFileAsync(__dirname + "/data/ibc-individuals", "utf8")
	.then(CSVToArray)
	.then(CSVParser)
]).then(a => {
	const [ incidents, individuals ] = a;

	const data = incidents.forEach(incident => {
		incident.individuals =
			individuals.filter(individual => individual.ibcCode.startsWith(incident.ibcCode));
	});

	return incidents;
}).then(incidents => fs.saveFileAsync(__dirname + "/incidents.json", JSON.stringify(incidents, null, '\t')));
