var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");



app.get("/", function(req, res){
  res.render("index");
});

app.get("/campgrounds", function(req, res){
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
    }

  ];

  res.render("campgrounds", {campgrounds: campgrounds} );
});


app.listen(3000, function(){
  console.log("serving on port 3000");
});