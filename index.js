const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mysql = require("mysql");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Your Email',
        pass: 'Your Password'
    }
});



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Employee',
});
db.connect(err => {
    if (err)
        console.log("Some Error Occurred");
    else
        console.log("You are Connected to Mysql Data Base");
});
const port = process.env.PORT || 8000;
const {
    connected,
    getMaxListeners
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
app.get('/createdatabase/:name', function (req, res) {
    let database = req.params.name;
    console.log(database);
    let q = 'CREATE DATABASE ' + database;
    console.log(q);
    db.query(q, (err) => {
        if (err)
            res.send("Some Error Occurred");
        else
            res.send("Database Created");
    });
});
app.post("/CheckIn", function (req, res) {
    let obj = req.body;
    let post = {
        UserName: obj.Name[0],
        UserEmail: obj.Email[0],
        UserPhone: obj.PhoneNumber[0],
        HostName: obj.Name[1],
        HostEmail: obj.Email[1],
        HostPhone: obj.PhoneNumber[1],
    };
    let q = 'INSERT INTO user SET ?'
    db.query(q, post, (err) => {
        if (err)
            res.send("Some Error Occurred");
        else {
            var newdate = new Date();
            var mailOptions = {
                from: 'Your Email',
                to: obj.Email[0],
                subject: 'Your CheckIn Details',
                html: '<h4>Hi, ' + obj.Name[0] + ',</h4><br><p>CheckIn: ' + newdate + '</p>',
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.send("Successfully Added");
        }
    });
    console.log(req.body);
});
app.post("/CheckOut", function (req, res) {
    let obj = req.body;
    console.log(req.body);
    let email = obj.Email;
    let q = 'UPDATE user SET CheckOut=NOW() where UserEmail="' + email + '"';
    console.log(q);
    db.query(q, (err) => {
        if (err)
            res.send("Some Error Occurred");
        else {
            let q1 = 'SELECT * from user where UserEmail="' + email + '"';
            console.log(q1);
            db.query(q1, (err, results) => {
                if (err)
                    res.send("Some Error Occurred");
                else {
                    var mailOptions = {
                        from: 'Your Email',
                        to: results[0].HostEmail,
                        subject: 'CheckIn Detail of ' + results[0].UserName,
                        html: '<h4>Hi, ' + results[0].HostName + ',</h4><br><p> Details Of ' + results[0].UserName + '<br> Name: ' + results[0].UserName + '<br>CheckIn: ' + results[0].CheckIn.toDateString() + '<br>CheckOut:' + results[0].CheckOut.toDateString() + '<br>Phone No: ' + results[0].UserPhone + '</p>',
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    console.log(results);
                    res.send("Successfull");
                }
            });
        }
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})