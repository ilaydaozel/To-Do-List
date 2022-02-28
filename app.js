const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();

const app = express();

//defining secret variables
db_username= process.env.DB_USERNAME;
db_password = process.env.DB_PASSWORD;

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+db_username+":"+db_password+"@cluster0.49ss6.mongodb.net/todolistDB")

//item schema
const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
//Default items

const item1 = new Item({
  name: "Welcome to your to do list"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item "
});
const defaultItems = [item1, item2, item3];

//list schema
const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {

    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
            console.log("You inserted the items to DB");
        }});
        res.redirect("/");
        }
         else {
          res.render('list', {  listTitle: "Today", newListItems: foundItems});
        }
  });
});

app.get("/:customListName", function(req, res) {
  const customListName =_.capitalize(req.params.customListName) ;
  //checking if the page existed before
  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
        if (!foundList) {
          const newList = new List({
            name: customListName,
            items: defaultItems
          })
          newList.save();
          res.redirect("/"+customListName);
          }
          else {
            res.render('list', {listTitle: foundList.name, newListItems: foundList.items});
          }
      }
  });
});


app.post("/", function(req, res) {
  const itemName = req.body.newLine;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }

  else{
    List.findOne({name: listName}, function(err, foundList){
          foundList.items.push(item);
          foundList.save();
          res.redirect("/" + listName);
        });
      }
  });

//to delete an item
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName==="Today"){
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("You removed the items to DB");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate( {name: listName}, {$pull: {items: {_id: checkedItemId}}},function(err, foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    })
  }
});




app.get("/about", function(req, res) {
  res.render("about");
})

app.listen(process.env.PORT || 3000, function() {
  //console.log("server started on port 3000");
});
