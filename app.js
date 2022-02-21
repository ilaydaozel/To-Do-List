const express= require("express");
const bodyParser= require("body-parser");
const app=express();
var items = ["Cook Food"];

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req,res){

  var today = new Date();

  var options ={
    weekday: "long",
    day:"numeric",
    month: "long"
  };
  var day= today.toLocaleDateString("en-US", options);
  res.render('list', {kindOfDay: day, newListItems: items});

  res.send();
});

app.post("/", function(req, res){
  item = req.body.newLine;
  items.push(item);
  res.redirect("/"); //redirects to the homeroute
})

app.listen(3000, function(){
  console.log("server started on port 3000");
});
