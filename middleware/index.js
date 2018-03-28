var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  //is user logged in
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, campground){
      if(err){
        res.redirect("back");
      }
      else{
        //is logged in user the creator
        if(campground.author.id.equals(req.user._id)) {
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
};

middlewareObj.checkCommentOwnership = function(req, res, next){
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
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = middlewareObj;