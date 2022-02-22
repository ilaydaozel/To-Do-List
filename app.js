const express= require("express");
const bodyParser= require("body-parser");
const date=require(__dirname + "/date.js");

const app=express();
const items = ["Cook Food", "Wash Dishes"];
const workItems = [];

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  const day = date.getDay();
  res.render('list', {listTitle: day, newListItems: items});
  res.send();
});

app.post("/", function(req, res){
  const item = req.body.newLine;
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

app.get("/about", function(req,res){
  res.render("about");
})

app.listen(3000, function(){
  console.log("server started on port 3000");
});
