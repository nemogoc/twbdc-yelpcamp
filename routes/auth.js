var express = require("express");
var router = express.Router();
var passport = require('passport');
var User = require("../models/user");

router.get("/", function (req, res) {
  res.render("home");
});


//REGISTER
router.get("/register", function (req, res) {
  res.render("auth/register");
});

router.post("/register", function (req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/register");
    }

    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//LOGIN
router.get("/login", function (req, res) {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
  }), function(req, res){

});

//LOGOUT
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out");
  res.redirect("/");
});


module.exports = router;
