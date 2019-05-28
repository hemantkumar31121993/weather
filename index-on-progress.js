var express = require('express');
var passport = require('passport');
var localStrat = require('passport-local').Strategy;
var session = require("express-session"),
    bodyParser = require("body-parser");
var app = express();

var DB = require('mysql').createConnection({
	host: "localhost",
	user: "root",
	password: "duleshwari",
	database: "weather"
});

DB.connect(function(err) {
	if(err)
		throw err;
	console.log("DB connected");
});



app.use("/static", express.static("static"));
app.use(session({ secret: "cats", resave:true, saveUninitialized:true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

passport.use('local', new localStrat(
	{passReqToCallback : true},
	function(req, username, password, done) {
		
		
		if(req.session.passport && req.session.passport.user) {
			
			return done(null, {u:username});
		}
		if(username == "hemant" && password == "kumar") {
			return done(null, {u:username});
		}
		return done(null, false, { message: 'Incorrect password.' });
	}
));

passport.serializeUser(function(user, done) {
  done(null, user.u);
});

passport.deserializeUser(function(id, done) {
  done(null, {u:id})
});

function isauth(req, res, next) {
	if(req.isAuthenticated())
		return next();
	else
		res.redirect("/")
}

app.listen(3000, "0.0.0.0", function () {
	
});

var cities = [];
{
	let q = "select * from cities;"
	DB.query(q, function (err, result, fields) {
		cities = result;
		
	});
}

app.get("/", function(req, res) {
	res.redirect("/city/1");
});

app.get("/city/:id", function(req, res) {
	let id = req.params.id;
	var p = new Date();
	let month = p.getMonth()+1;
	let day = p.getDate();
	if(month < 10)
		month = "0"+month;
	if(day < 10)
		day = "0" + day;
	var date = p.getFullYear()+"-"+month+"-"+day;
	
	var query = "select * from data where id=\"" + id + "\" and date=\"" + date+"\"";
	
	DB.query(query, function(err, result, fields) {
		if(err) {
			res.send(err.message);
			return;
		}
		
		if(result.length > 0) {
			// res.send(result[0].toString());
			let r = result[0];
			res.render("index", { city: cities[id-1].name, state: cities[id-1].state, maximum:r.maximum, minimum:r.minimum, humidity:r.humidity, wind:r.wind, pressure:r.pressure, type:r.type, forecast:[]});
		} else {
			res.render("index", { city: cities[id-1].name, state: cities[id-1].state, maximum: "NA", minimum: "NA", humidity: "NA", wind: "NA", pressure: "NA", type: "1", forecast: []});
		}
	});
});

app.get("/login", function(req, res) {
	if(req.isAuthenticated()) {
		res.redirect("/admin");
	} else {
		res.render("login.ejs");
	}
});

/*
app.post("/login", passport.authenticate('local', {successRedirect: "/admin", failureRedirect: "/login"}));

app.get("/admin", isauth, function (req, res) {
	res.send("admin login");
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});
*/
