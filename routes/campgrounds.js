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
router.get("/new", function (req, res) {
  res.render("campgrounds/new");
});

//CREATE route - Adds new campground (from NEW form) to DB
router.post("/", function (req, res) {
  createCampground(req.body.name, req.body.url, req.body.description);
  //technically a race condition here, new campground may not render

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

//doesn't block, may introduce race condition
function createCampground(name, image, description) {
  Campground.create({name: name, image: image, description: description}, function (err, ret) {
    if (err) {
      console.log("Error adding campground to db: " + err);
    }
  });
}


module.exports = router;
