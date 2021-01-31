//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

const today = "Hoje";
const workItems = [];
const defaultItems = [
    {name: "Bem vindo à sua lista"},
    {name: "Pressione + para adicionar um novo item"},
    {name: "<--- Pressione aqui para deletar um item."}
]

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const itemsSchema = new mongoose.Schema({
    name: String
});

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const Item = mongoose.model("items", itemsSchema);
const List = mongoose.model("lists", listSchema)



//Ignore favicon.ico default requests from browsers.
app.get('/favicon.ico', function(req, res) { 
    res.sendStatus(204); 
});


app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems) {
        if (err) {
            console.log(err);
        } else if (foundItems.length === 0){
            res.render("list", {
                listTitle: today,
                newListItem: defaultItems
            });
            
        } else {
            res.render("list", {
                listTitle: today, 
                newListItem: foundItems
            });
        }
    });

});

app.post("/", async function(req, res) {
    const item = new Item({
        name: req.body.newItem,
    });
    const listName = req.body.list;
    if (req.body.list === "Hoje") {
        await item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, async function (err, foundList) {
            foundList.items.push(item);
            await foundList.save();
        });
        // await List.updateOne({name: listName}, {$push: {items: item}});
        res.redirect("/" + listName);
    }
});



app.get("/:customList", async function(req, res) {
    customListName = _.capitalize(req.params.customList);
    await List.findOne({name: customListName}, async function(err, foundList) {

        if (err) {
            console.log(err);
        } else if (!foundList){
            const list = new List({
                name: customListName,
                items: []
            });
            await list.save();  
            res.render("list", {
                listTitle: list.name,
                newListItem: defaultItems
            }); 
        } else if (foundList.items.length === 0) {
            res.render("list", {
                listTitle: foundList.name,
                newListItem: defaultItems
            });
        } else {
            res.render("list", {
                listTitle: foundList.name,
                newListItem: foundList.items
            });
        } 
    });
});
    

app.post("/work", function(req, res) {
    workItems.push(req.body.newItem);
});


app.post("/delete-item", async function(req, res) {
    const checkedItemId = req.body.deleteBox;
    const listName = req.body.listName;
    console.log(listName)
    if (checkedItemId !== '' && typeof checkedItemId !== "undefined") {
        
        if (listName === "Hoje") {
            await Item.deleteOne({_id: checkedItemId}, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Element deleted successfully");
                }
            });
            res.redirect("/");
        } else {
            await List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Element deleted successfully");
                }
            });
            res.redirect("/" + listName);
        }
        

        
    }
    
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});
