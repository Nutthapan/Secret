require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
console.log(process.env)
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@bossy.90bz4ho.mongodb.net/UserDB?retryWrites=true&w=majority&ssl=true");

// Define a secret key for encryption
const secretKey = "ThisIsASecretKey"; // Replace with your own secret key

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Use mongoose-encryption plugin to encrypt the 'password' field
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const email = req.body.username;
        const password = req.body.password;
        const newUser = new User({ email, password });

        await newUser.save();
        res.redirect("/secrets");
    } catch (err) {
        console.error(err);
        res.send("Error occurred during registration.");
    }
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const foundUser = await User.findOne({ email: username });

        if (foundUser && foundUser.password === password) {
            res.redirect("/secrets");
        } else {
            res.send("Invalid username or password");
        }
    } catch (err) {
        console.error(err);
        res.send("Error occurred during login.");
    }
});

app.get("/secrets", (req, res) => {
    res.render("secrets");
});

app.get("/logout", (req,res)=>{
   
    res.redirect("/")
})


app.get("/", (req, res) => {
    res.render("home");
});

app.listen(3000, () => {
    console.log("Server opened on port 3000");
});








