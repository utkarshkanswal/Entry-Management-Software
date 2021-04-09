const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const port = process.env.PORT || 8000;
const {
    connected
} = require("process");
const {
    functions
} = require("lodash");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.set("views", __dirname + "/views"); // set express to look in this folder to render our view



app.get("/", function (req, res) {
    res.render("index");
});
app.get("/CheckIn", function (req, res) {
    res.render("CheckIn");
});
app.get("/CheckOut", function (req, res) {
    res.render("CheckOut");
});

app.post("/CheckIn", function (req, res) {
    console.log(req.body);
    res.send("Post Request");
});
app.post("/CheckOut", function (req, res) {
    console.log(req.body);
    res.send("Post Request");
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})