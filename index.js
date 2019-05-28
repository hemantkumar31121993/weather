var express = require('express');
var bodyParser = require("body-parser");
var app = express();

app.use("/static", express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.listen(3000, "0.0.0.0", function () {
    console.log("Running the server on port 3000");	
});

app.get("/", function(req, res) {
	res.redirect("/city/1");
});

cities = [
            {name: "Kanpur", state: "Uttar Pradesh"},
            {name: "New Delhi", state: "Delhi"},
            {name: "Thiruvanthapuram", state: "Kerala"}
        ];

weather = [
        {maximum:43,minimum:38,humidity:7,wind:17.1, pressure:1008, type:1},
        {maximum:47,minimum:40,humidity:6,wind:15.1, pressure:1009, type:2},
        {maximum:35,minimum:32,humidity:15,wind:10.2, pressure:1020, type:1}
        ];

app.get("/city/:id", function(req, res) {
	let id = parseInt(req.params.id);

    if(id >= 1 && id <=3  ) {
        r = weather[id-1];
		res.render("index", { city: cities[id-1].name, state: cities[id-1].state, maximum:r.maximum, minimum:r.minimum, humidity:r.humidity, wind:r.wind, pressure:r.pressure, type:r.type, forecast:[]});
    } else {
		res.render("index", { city: "NoCity", state: "NoState", maximum: "NA", minimum: "NA", humidity: "NA", wind: "NA", pressure: "NA", type: "1", forecast: []});
    }
});

/*

app.get("/login", function(req, res) {
	if(req.isAuthenticated()) {
		res.redirect("/admin");
	} else {
		res.render("login.ejs");
	}
});


app.post("/login", passport.authenticate('local', {successRedirect: "/admin", failureRedirect: "/login"}));

app.get("/admin", isauth, function (req, res) {
	res.send("admin login");
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});
*/
