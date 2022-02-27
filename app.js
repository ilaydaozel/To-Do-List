const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
// const items = ["Cook Food", "Wash Dishes"];
// const workItems = [];

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
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
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        //INSERT DEFAULT ELEMENTS
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("You inserted the items to DB");
          }
        });
        res.redirect("/");
      } else {
        res.render('list', {  listTitle: "Today",newListItems: foundItems
        });
      }
    }
  });

});

app.post("/", function(req, res) {
  const itemName = req.body.newLine;
  const listName = req.body.listTitle;

  const newItem = new Item({
    name: itemName
  });

  if(listName==="Today"){
    newItem.save();
    res.redirect("/");
  }
  else{
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

})

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  // const listName = req.body.listName;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log("You removed the items to DB");
    }
  });
  res.redirect("/");
});


app.get("/:customListName", function(req, res) {
  const customListName = req.params.customListName;
  console.log(customListName);
  const newList = new List({
    name: customListName,
    items: defaultItems
  })
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

    else {
      console.log("error");
    }
  })


});


app.get("/about", function(req, res) {
  res.render("about");
})

app.listen(3000, function() {
  console.log("server started on port 3000");
});
