const express = require("express");
const search = require("./search");
const app = express();

app.get("/search", (req, res) => {
	search({ location: req.query.q })
	.then(results => {
		res.end(JSON.stringify(results));
	})
	.catch(err => { throw err; });
});

app.listen(8080);
