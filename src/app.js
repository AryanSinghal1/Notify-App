const express = require("express");
const path = require("path");
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("./connection/conn");
require('dotenv').config()
const app = express();
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const publicPath = path.join(__dirname, "../public");
const PersonRegister = require("./models/person");
const port = process.env.PORT || 8000;
app.use(express.static(publicPath));
hbs.registerPartials(partialsPath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.set("views", viewPath);
app.get("/", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", async (req, res) => {
  try {
    if (req.body.password === req.body.cpassword) {
      const registerPerson = new PersonRegister({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });
      const token = await registerPerson.generateToken();
      await registerPerson.save();
      res.cookie("register", token, {
        expires: new Date(Date.now() + 30000),
      });
      res.render('index');
    } else {
      res.send("Password not matched");
    }
  } catch (e) {
    console.log(e);
  }
});
app.post("/", async (req, res) => {
  try {
    const personEmail = req.body.email;
    const registered = await PersonRegister.findOne({ email: personEmail });
    if (registered) {
        const token = await registered.generateToken();
        // res.cookie("login", token, {
        //   expires: new Date(Date.now() + 30000),
        // }); 
        console.log(`Password is ${registered.password}`);
        const isVerified = await bcrypt.compare(req.body.password, registered.password);
        // const bpswrd =  bcrypt.hash(req.body.password);
        console.log(`Password becomes ${req.body.password} ${registered.password}`);
        console.log(isVerified);
        if(isVerified){
            res.render("index");
        }else{
            res.send("Invalid login");
        }
    }else {
        res.send("Invalid login credentials");
      }
  } catch (e) {
    console.log(e);
  }
});
app.get("/notes", (req, res) => {
  res.render("index");
});
app.listen(port, () => {
  console.log(`Server is running on port no. ${port}`);
});
