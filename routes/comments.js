var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require('../models/comment');
var Campground = require('../models/campground');


//NEW
router.get("/new", isLoggedIn, function (req, res) {
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
router.post("/", isLoggedIn, function (req, res) {
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
        res.redirect("/campgrounds/" + campground._id);
      });
    }
  });
});

//EDIT
router.get("/:commentId/edit", checkCommentOwnership, function(req, res){
  Comment.findById(req.params.commentId, function(err, comment){
    if (err){
      console.log(err);
      return res.redirect("/campgrounds");
    }
    res.render("comments/edit", {comment: comment, campgroundId: req.params.id});
  });
});

//UPDATE
router.put("/:commentId", checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
    if (err){
      console.log(err);
    }
    res.redirect("/campgrounds/" + req.params.id);
  });
});

//DESTROY
router.delete("/:commentId", checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.commentId, function(err){
    if(err){
      console.log(err);
    }
    res.redirect("/campgrounds/" + req.params.id);
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
  //is user logged in
  if(req.isAuthenticated()){
    Comment.findById(req.params.commentId, function(err, comment){
      if(err){
        res.redirect("back");
      }
      else{
        //is logged in user the creator
        if(comment.author.id.equals(req.user._id)) {
          return next();
        }
        else {
          res.redirect("back");
        }
      }
    });
  }
  else {
    res.redirect("back");
  }
}

module.exports = router;
