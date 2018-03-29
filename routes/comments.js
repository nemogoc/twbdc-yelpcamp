var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Campground = require('../models/campground');
var middleware = require('../middleware');


//NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      Comment.create(req.body.comment, function (err, comment) {
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save();
        campground.comments.push(comment);
        campground.save();
        req.flash("success", "Successfully added comment!");
        res.redirect("/campgrounds/" + campground._id);
      });
    }
  });
});

//EDIT
router.get("/:commentId/edit", middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.commentId, function(err, comment){
    if (err || !comment){
      console.log(err);
      return res.redirect("/campgrounds");
    }
    res.render("comments/edit", {comment: comment, campgroundId: req.params.id});
  });
});

//UPDATE
router.put("/:commentId", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
    if (err){
      console.log(err);
    }
    res.redirect("/campgrounds/" + req.params.id);
  });
});

//DESTROY
router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.commentId, function(err){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong, try again later");
      return res.redirect("/campgrounds/" + req.params.id);
    }
    req.flash("success", "Comment deleted");
    res.redirect("/campgrounds/" + req.params.id);
  });
});


module.exports = router;
