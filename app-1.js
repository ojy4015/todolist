const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// binds all of exports from date.js to date constant
// const date = require(__dirname + "/date.js");
// console.log(date());

const app = express();

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB');

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

// Item.insertMany(defaultItems, function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("successfully saved all the items to itemsDB");
//   }
// });

// Item.find(function(err, items) {
//   if (err) {
//     console.log(err);
//   } else {
//     mongoose.connection.close();
//
//     items.forEach(function(item) {
//       console.log(item.name);
//     });
//   }
// });

// 1, 6
app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) { //foundItems is array
    // console.log(foundItems);

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
        // kindOfDay: day,
        listTitle: "Today",
        newListItems: foundItems
      });
    }


    // if (err) {
    //   console.log(err);
    // } else {
    //   mongoose.connection.close();
    //
    //   foundItems.forEach(function(foundItem) {
    //     console.log(foundItem.name);
    //   });
    // }
  });
  // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // let day = date.getDate();
  // const day = date.getDate();

});

// /work-1, 6
// app.get("/work", function(req, res) {
//
//   // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   res.render('list', {
//     // kindOfDay: day,
//     listTitle: "Work List",
//     newListItems: workItems
//   });
// });

// route parameter
app.get("/:customListName", function(req, res) {
  const customListName = req.params.customListName;


  List.findOne({
    name: customListName
  }, function(err, foundList) { //foundList is object
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



  // List.find({}, function(err, foundItems) {
  // console.log(foundItems);

  // if (foundItems.length === 0) {
  //   List.insertMany(defaultItems, function(err) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("successfully saved all the items to itemsDB");
  //     }
  //
  //     res.redirect("/:customListName");
  //   });
  // } else {
  //   res.render('list', {
  //     // kindOfDay: day,
  //     listTitle: "Today",
  //     newListItems: foundItems
  //   });
  // }


  // if (err) {
  //   console.log(err);
  // } else {
  //   mongoose.connection.close();
  //
  //   foundItems.forEach(function(foundItem) {
  //     console.log(foundItem.name);
  //   });
  // }
});



// /about-1, 6
app.get("/about", function(req, res) {

  // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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


  // res.render('list', {
  //   newListItem: item
  // });

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
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkeddItemId
        }
      }
    }, function(err, foundList111) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

// findOne({name: listName}, function(err, foundList){
// foundList.items.push(item);
// foundList.save();
//
// res.redirect("/" + listName);




// Item.deleteOne({_id:checkeddItemId}, function(err){
//   if (err){
//     console.lop(err);
//   } else {
//     console.log("successfully deleted the document.");
//   }
// });




// work-4
// app.post("/work", function(req, res) {
//   console.log("app.post/work");
//   const item = req.body.newItem;
//   // res.render('list', {
//   //   newListItem: item
//   // });
//   workItems.push(item);
//   // 5
//   res.redirect("/work");
// });



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// Item.deleteOne({_id:"633149b765611ede10d62a63"}, function(err){
//   if (err){
//     console.lop(err);
//   } else {
//     console.log("successfully deleted the document.");
//   }
// });
