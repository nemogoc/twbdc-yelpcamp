var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDb = require('./seeds'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),

  //TODO: maybe not used here
  passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost/yelpcamp", function (err, body) {
  if (err) {
    console.log("Error connecting: " + err);
  }
});

seedDb();

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
  secret: "There are some campgrounds here and they are pretty cool", //in a real app, this should be an env var
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
  res.render("home");
});

//INDEX route - Displays list of all campgrounds
app.get("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
  res.render("campgrounds/new");
});

//CREATE route - Adds new campground (from NEW form) to DB
app.post("/campgrounds", function (req, res) {
  createCampground(req.body.name, req.body.url, req.body.description);
  //technically a race condition here, new campground may not render

  res.redirect("/campgrounds");
});

//SHOW route - show more detail about one specific campground
app.get("/campgrounds/:id", function (req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("campgrounds/show", {campground: campground});
    }
  });
});

//COMMENTS
//NEW
app.get("/campgrounds/:id/comments/new", function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    }
    else {
      Comment.create(req.body.comment, function (err, comment) {
        campground.comments.push(comment);
        campground.save();
        res.redirect("/campgrounds/" + campground._id);
      });
    }
  });
});

//REGISTER

app.get("/register", function (req, res) {
  res.render("auth/register");
});

app.post("/register", function (req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("/register");
    }

    passport.authenticate("local")(req, res, function() {
      res.redirect("/campgrounds");
    });
  });
});


app.listen(3000, function () {
  console.log("serving on port 3000");
});


//doesn't block, may introduce race condition
function createCampground(name, image, description) {
  Campground.create({name: name, image: image, description: description}, function (err, ret) {
    if (err) {
      console.log("Error adding campground to db: " + err);
    }
  });
}
