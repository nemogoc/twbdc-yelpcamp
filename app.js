var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

mongoose.connect("mongodb://localhost/yelpcamp", function(err, body){
  if(err){
    console.log("Error connecting: " + err);
  }
});

var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(req, res){
  res.render("index");
});

app.post("/campgrounds", function(req, res){
  createCampground(req.body.name, req.body.url);
  //technically a race condition here, new campground may not render

  res.redirect("/campgrounds");
});

app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if (err){
      console.log("Error getting campgrounds from db: " + err);
    }
    else {
      res.render("campgrounds", {campgrounds: campgrounds} );
    }
  });
});

app.get("/campgrounds/new", function(req, res){
  res.render("new");
});


app.listen(3000, function(){
  console.log("serving on port 3000");
});


//doesn't block, may introduce race condition
function createCampground(name, image) {
  Campground.create({ name: name, image: image }, function (err, ret) {
    if (err) {
      console.log("Error adding campground to db: " + err);
    }
  });
}

//This doesn't work yet because it doesn't block the render.
function getCampgrounds(){
  var campgrounds = [];
  Campground.find({}, function(err, ret){
    if (err){
      console.log("Error getting campgrounds from db: " + err);
    }
    else {
      console.log(ret);
      ret.forEach(function(campgr){
        campgrounds.push({
          name: campgr.name,
          image: campgr.image
        })
      });
      console.log("In call: " + campgrounds);
      return campgrounds;
    }
  });
}
