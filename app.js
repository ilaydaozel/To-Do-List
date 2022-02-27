const express= require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const date=require(__dirname + "/date.js");

const app=express();
// const items = ["Cook Food", "Wash Dishes"];
// const workItems = [];

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to your to do list"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item "
});
const defaultItems=[item1, item2, item3];




app.get("/", function(req,res){
  Item.find({},function(err, foundItems){
      if(err){
        console.log(err);
      }
      else{
        if(foundItems.length === 0){
          //INSERT DEFAULT ELEMENTS
          Item.insertMany(defaultItems, function(err){
            if(err){
              console.log(err);
            }
            else{
              console.log("You inserted the items to DB");
            }
          });
          res.redirect("/");
        }
        else{
          res.render('list', {listTitle: "Today", newListItems: foundItems});
        }
      }
  });

});

app.post("/", function(req, res){
  const itemName = req.body.newLine;
  const newItem = new Item({
    name : itemName
  });
  newItem.save();
  res.redirect("/");
})

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove( checkedItemId, function(err){
    if(!err){
      console.log("You removed the items to DB");
    }
  });
  res.redirect("/");
});

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
