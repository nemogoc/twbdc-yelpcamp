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
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function(req, res){
  res.render("home");
});

//INDEX route - Displays list of all campgrounds
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, campgrounds){
    if (err){
      console.log("Error getting campgrounds from db: " + err);
    }
    else {
      res.render("index", {campgrounds: campgrounds} );
    }
  });
});

//NEW route - Displays form to make new campground
app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

//CREATE route - Adds new campground (from NEW form) to DB
app.post("/campgrounds", function(req, res){
  createCampground(req.body.name, req.body.url, req.body.description);
  //technically a race condition here, new campground may not render

  res.redirect("/campgrounds");
});

//SHOW route - show more detail about one specific campground
app.get("/campgrounds/:id", function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if (err){
      console.log(error);
    }
    else {
      res.render("show", { campground: campground });
    }
  });
});


app.listen(3000, function(){
  console.log("serving on port 3000");
});


//doesn't block, may introduce race condition
function createCampground(name, image, description) {
  Campground.create({ name: name, image: image, description: description }, function (err, ret) {
    if (err) {
      console.log("Error adding campground to db: " + err);
    }
  });
}
