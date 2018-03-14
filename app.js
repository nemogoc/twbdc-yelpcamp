var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var campgrounds = [
  {
    name: "Yellowstone Lake",
    image: "/resources/img/548022.png"
  },
  {
    name: "New Glarus Woods",
    image: "/resources/img/839807.png"
  },
  {
    name: "Governor Dodge",
    image: "/resources/img/1845906.png"
  },
  {
    name: "Yellowstone Lake",
    image: "/resources/img/548022.png"
  },
  {
    name: "New Glarus Woods",
    image: "/resources/img/839807.png"
  },
  {
    name: "Governor Dodge",
    image: "/resources/img/1845906.png"
  },
  {
    name: "Yellowstone Lake",
    image: "/resources/img/548022.png"
  },
  {
    name: "New Glarus Woods",
    image: "/resources/img/839807.png"
  },
  {
    name: "Governor Dodge",
    image: "/resources/img/1845906.png"
  }
];

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", function(req, res){
  res.render("index");
});

app.post("/campgrounds", function(req, res){
  campgrounds.push({
    name: req.body.name,
    image: req.body.url
  });

  res.redirect("/campgrounds");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds} );
});

app.get("/campgrounds/new", function(req, res){
  res.render("new");
});


app.listen(3000, function(){
  console.log("serving on port 3000");
});