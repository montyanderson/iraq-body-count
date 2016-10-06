require("./promisify");
const fs = require("fs");
const redis = require("redis");
const rsearch = require("rsearch");

const db = redis.createClient();

function search(key, t, n = 0, results = new Set()) {
	return db.sscanAsync(key, n, "MATCH", t, "COUNT", 1000)
	.then(data => {
		results.add(...data[1]);
		if(data[0] > 0) return search(key, t, data[0], results);
		return results;
	});
};

module.exports = search;

const NanoTimer = require("nanotimer");

const timer = new NanoTimer();

db.on("ready", () => {
	timer.time(callback => {
		search("*")
		.then(() => callback())
		.catch(err => callback(err));
	}, "", "s", (time) => {
		console.log(1 / time + " ops/sec");
	});
});
