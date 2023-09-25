//jshint esversion:6
import "dotenv/config";
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
    secret:"Our little secret",
    resave:false,
    saveUninitialized: false}));


    app.use(passport.initialize());
    app.use(passport.session());

mongoose
  .connect("mongodb://127.0.0.1:27017/userDB")
  .then(() => {
    console.log("Database Established");
  })
  .catch((error) => {
    console.error(error);
  });

const userSchema = new mongoose.Schema({
  email: "String",
  password: "String",
});

userSchema.plugin(passportLocalMongoose);



const User = mongoose.model("User", userSchema);


passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout",(req,res)=>{
    req.logOut(function(err){
        if(err)
        {
            console.log(err);
        }
        res.redirect("/");
    })
   
})
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
    })

app.post("/register", (req, res) => {
    User.register({username:req.body.username}, req.body.password, function(err, user) {
        if (err) { 
            console.log(err);
            res.redirect("/register")
         }
         else{
             passport.authenticate('local')(req, res, ()=>{
                res.redirect("/secrets")
            })
         }

      
        })
    })
app.post("/login", (req, res) => {
    const user =new User({
        username : req.body.username,
        password:req.body.password
    
    })

    req.login(user,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate('local')(req, res, ()=>{
                res.redirect("/secrets")
            })
        }

    })
});



app.listen(3000, function () {
  console.log("Server is running on port :", this.address().port);
});
