require("./lib/promisify");
const fs = require("fs");
const redis = require("redis");
const rsearch = require("rsearch");
const NanoTimer = require("nanotimer");

const ibcData = require("./lib/ibcData");

const db = redis.createClient();

function search(s) {
	const key = Object.keys(s)[0];
	const query = s[key];
	let cursor = 0;
	const results = new Map();

	function recursive() {
		return db.zscanAsync("individuals:" + key, cursor, "MATCH", query)
		.then(data => {
			cursor = data[0];
			const scan = data[1];

			for(let i = 0; i < scan.length; i += 2) {
				const field = scan[i];
				const id = scan[i + 1];

				if(!results.has(id)) {
					const obj = { id };
					obj[key] = field;

					results.set(+id, obj);
				}
			}

			if(cursor > 0) return recursive();
			return results;
		});
	}

	return recursive().then(m => {
		const arr = Array.from(m, e => e[1]);
		return Promise.all(arr.map(load));
	});
}

function load(a) {
	const fields = ["ibcCode", "sex", "earliestDate", "latestDate", "parentalStatus", "nameOrIdentifyingDetails", "location", "maritalStatus", "age"];

	const query = db.multi();

	fields.forEach(field => {
		if(!a[field]) {
			query.ZRANGEBYSCORE("individuals:" + field, a.id, a.id, "LIMIT", 0, 1);
		}
	});

	return query.execAsync()
	.then(res => {
		res.forEach((value, i) => {
			a[fields[i]] = value[0];
		});

		return a;
	});
}

const timer = new NanoTimer();

search({ location: "*" })
.then(results => console.log(results));

module.exports = search;
