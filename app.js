const express = require("express");
const search = require("./search");
const app = express();

app.get("/", (req, res) => {
	res.end(`
<!DOCTYPE html>
<html>
	<head>

	</head>
	<body>

		<input id="search">
		<div class="results"></div>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
		<script>
		$("#search").keyup(function() {
			$.getJSON("/search?q=" + $(this).val(), function(res) {
				$(".results").html(JSON.stringify(res));
			});
		});
		</script>

	</body>
</html>
`).trim()
});

app.get("/search", (req, res) => {
	search({ location: req.query.q })
	.then(results => {
		res.end(JSON.stringify(results));
	})
	.catch(err => { throw err; });
});

app.listen(8080);
