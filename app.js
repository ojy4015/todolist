const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// mongoose.connect('mongodb://localhost:27017/todolistDB'); // local DB
// mongoose.connect('mongodb+srv://admin-hyung:Test123@cluster0.crrixtz.mongodb.net/todolistDB'); // atlas
// mongodb+srv://admin-hyung:<password>@cluster0.crrixtz.mongodb.net/?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://admin-hyung:Test123@cluster0.crrixtz.mongodb.net/todolistDB'); // atlas
// mongoose.connect('mongodb+srv://admin-hyung:mong5209!@#@cluster0.crrixtz.mongodb.net/todolistDB'); // atlas
// Schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please check your data entry, no name specified!"]
  }
});

// listSchema
const listSchema = {
  name: String,
  items: [itemSchema]
};

// model
const Item = mongoose.model("Item", itemSchema);

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add item"
});

const item3 = new Item({
  name: "Hit the <-- to delete item"
});

const defaultItems = [item1, item2, item3];

// 1, 6
app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) { //foundItems is array

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved all the items to itemsDB");
        }
        res.redirect("/");
      });
    } else {
      res.render('list', {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});

// route parameter
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList) { //foundList is object, if pulled it is object pulled from the array
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);

      } else {
        // Show existing list
        res.render('list', {
          // kindOfDay: day,
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});



// /about-1, 6
app.get("/about", function(req, res) {
  res.render('about');
});

// 4
app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();

      res.redirect("/" + listName);
    });
  }
});

// delete
app.post("/delete", function(req, res) {
  // console.log("app.post/delete");
  const checkeddItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkeddItemId, function(err) {
      if (!err) {
        console.log("successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else { // coming from custom lists
    List.findOneAndUpdate({name: listName},
      {$pull: {items: {_id: checkeddItemId}}},
      function(err, foundList) { // foundList is the array before pulled
      if (!err) {res.redirect("/" + listName);}
    });
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully.");
});
