var express = require("express");
var router = express.Router();
var Campground = require('../models/campground');

//INDEX route - Displays list of all campgrounds
router.get("/", function (req, res) {
  Campground.find({}, function (err, campgrounds) {
    if (err) {
      console.log("Error getting campgrounds from db: " + err);
    }
    else {
      res.render("campgrounds/index", {campgrounds: campgrounds});
    }
  });
});

//NEW route - Displays form to make new campground
router.get("/new", isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

//CREATE route - Adds new campground (from NEW form) to DB
router.post("/", isLoggedIn, function (req, res) {
  var author = {
    id: req.user._id,
    username: req.user.username
  };

  Campground.create({name: req.body.name, image: req.body.url, description: req.body.description, author: author}, function (err, ret) {
    if (err) {
      console.log("Error adding campground to db: " + err);
    }
  });

  res.redirect("/campgrounds");
});

//SHOW route - show more detail about one specific campground
router.get("/:id", function (req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/show", {campground: campground});
    }
  });
});

//EDIT
router.get("/:id/edit", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err){
      console.log(err);
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground: campground});
  });
});

//UPDATE
router.put("/:id", function(req, res){
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
    if(err){
      console.log(err);
      return res.redirect("/campgrounds");
    }
    res.redirect("/campgrounds/" + campground._id);
  });
});

//DESTROY
router.delete("/:id", function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err){
      console.log(err);
    }
    res.redirect("/campgrounds");
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
