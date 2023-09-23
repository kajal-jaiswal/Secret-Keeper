//jshint esversion:6
import "dotenv/config";
import  express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose, { Schema } from "mongoose";
import md5 from "md5";

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

console.log(md5("12345"));


mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.then(()=>{
    console.log("Database Established");
})
.catch((error)=>{
    console.error(error);
})

const userSchema =new mongoose.Schema({
    email:"String",
    password:"String"

})



const User = mongoose.model("User", userSchema);





app.get("/",(req,res)=>{
    res.render("home");
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    const user =new User({
        email : req.body.username ,
        password: md5(req.body.password)
    })
    user.save().then(()=>{
        res.render("secrets");


    })
    
    })
    app.post("/login",(req,res)=>{
        const username =req.body.username;
        const password =md5(req.body.password);

        User.findOne({email:username})
        .then((foundUser)=>{
            if(foundUser.password === password){
                res.render("secrets");
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    })


app.listen(3000,function(){
    console.log('Server is running on port :',this.address().port);
})

