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

app.use(express.static("static"));
app.use(session({ secret: "cats", resave:true, saveUninitialized:true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

passport.use('local', new localStrat(
	{passReqToCallback : true},
	function(req, username, password, done) {
		console.log(username, password);
		console.log(req.session);
		if(req.session.passport && req.session.passport.user) {
			console.log("shortcircuit")
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

app.listen(3000, "0.0.0.0", function () {
	console.log("server running on port 3000");
})

app.get("/:id", function(req, res) {
	var p = new Date();
	var date = p.getFullYear()+"-"+(p.getMonth()+1)+"-"+p.getDate();
	var query = "select * from data where id=" + req.param.id + " and date=" + date;
	DB.query(query, function(err, result, fields) {

	});
})