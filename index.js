require("./lib/promisify");
const fs = require("fs");
const redis = require("redis");
const rsearch = require("rsearch");

const ibcData = require("./lib/ibcData");

const db = redis.createClient();

function search(t, n = 0, results = new Set()) {
	return db.sscanAsync("locations", n, "MATCH", t, "COUNT", 1000)
	.then(data => {
		results.add(...data[1]);
		console.log(data[0]);
		if(data[0] > 0) return search(t, data[0], results);
		return results;
	});
}

ibcData()
.then(data => {
	const { individuals, incidents } = data;

	const query = db.multi();

	individuals.forEach((a, i) => {
		for(let key in a) {
			query.zaddAsync("individuals:" + key, i, a[key] || "");
		}
	});

	return query.execAsync();
})
.then(() => {

})
.catch(err => console.log(err));
