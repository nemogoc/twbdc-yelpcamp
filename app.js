var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  flash = require('connect-flash'),
  User = require('./models/user'),
  seedDb = require('./seeds'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override');

//routes
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/auth");

mongoose.connect("mongodb://localhost/yelpcamp", function (err, body) {
  if (err) {
    console.log("Error connecting: " + err);
  }
});

// seedDb();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require('express-session')({
  secret: "There are some campgrounds here and they are pretty cool", //in a real app, this should be an env var
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000, function () {
  console.log("serving on port 3000");
});
