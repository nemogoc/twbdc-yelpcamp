var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  //is user logged in
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, campground){
      if(err || !campground){
        req.flash("error", "Something went wrong, try again later");
        res.redirect("back");
      }
      else{
        //is logged in user the creator
        if(campground.author.id.equals(req.user._id)) {
          return next();
        }
        else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You must be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  //is user logged in
  if(req.isAuthenticated()){
    Comment.findById(req.params.commentId, function(err, comment){
      if(err || !comment){
        res.redirect("back");
      }
      else{
        //is logged in user the creator
        if(comment.author.id.equals(req.user._id)) {
          return next();
        }
        else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  }
  else {
    req.flash("error", "You must be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You must be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj;