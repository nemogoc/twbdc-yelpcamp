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
      return res.render("/register");
    }

    passport.authenticate("local")(req, res, function () {
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
    failureRedirect: "/login"
  }), function(req, res){

});

//LOGOUT
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


module.exports = router;
