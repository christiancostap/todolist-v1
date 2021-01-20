const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = []; 
let workItems = [];


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
    let options = {weekday: 'long', day: 'numeric', month: 'long'}
    let today = new Date().toLocaleDateString('pt-BR', options);
    res.render("list", {listTitle: today, newListItem: items});
});


app.post("/", function(req, res) {
    let item = req.body.newItem;

    if (req.body.list === "Trabalho") {
        workItems.push(item);
        res.redirect("/work");
    } else{
        items.push(item);
        res.redirect("/");
    }
    
    
});


app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Trabalho", newListItem: workItems});
});

app.post("/work", function(req, res) {
    workItems.push(req.body.newItem);
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});