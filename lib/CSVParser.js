const camelCase = require("camelcase");

module.exports = function CSVParser(data) {
	const lines = data.filter(l => l.length > 1);
	const fields = lines.shift().map(a => camelCase(a));

	return lines.map(l => {
		const obj = {};

		fields.forEach((field, i) => {
			obj[field] = l[i];
		});

		return obj;
	});
};
