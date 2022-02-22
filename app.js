const express= require("express");
const bodyParser= require("body-parser");
const app=express();
var items = ["Cook Food", "Wash Dishes"];
var workItems = [];

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/", function(req,res){

  var today = new Date();

  var options ={
    weekday: "long",
    day:"numeric",
    month: "long"
  };
  let day= today.toLocaleDateString("en-US", options);
  res.render('list', {listTitle: day, newListItems: items});

  res.send();
});

app.post("/", function(req, res){
  let item = req.body.newLine;
  if(req.body.list==="Work"){
    workItems.push(item);
    res.redirect("/work");
  }else{
      items.push(item);
      res.redirect("/");
  }
 //redirects to the homeroute

})
app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems} )
});

app.post("/work", function(req,res){
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.listen(3000, function(){
  console.log("server started on port 3000");
});
