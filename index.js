const bluebird = require("bluebird");
const fs = require("fs");

bluebird.promisifyAll(fs);
global.Promise = bluebird;

const ibcData = require("./lib/ibcData");

ibcData()
.then(ibcData => {
	const { incidents, individuals } = ibcData;

	console.log(incidents, individuals);

	const data = incidents.forEach(incident => {
		incident.individuals =
			individuals.filter(individual => individual.ibcCode.startsWith(incident.ibcCode));
	});

	return incidents;
}).then(incidents => fs.writeFileAsync(__dirname + "/incidents.json", JSON.stringify(incidents, null, '\t')));
