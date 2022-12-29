require("dotenv").config();
const express = require("express");
const path = require("path")
const userModel=require("./models/schema")
const jwt=require('jsonwebtoken')
const app = express();

const bcrypt=require("bcrypt")
const http =require("http").createServer(app)
let cookieParser=require("cookie-parser");
const { dirname } = require("path");

// var LocalStorage = require('node-localstorage').LocalStorage,
// localStorage = new LocalStorage('./scratch');
require("./db/conn");
const port = process.env.port  || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
;


app.use(express.static(__dirname+"/public"))

app.get("/register",(req, res) =>{
    res.sendFile(__dirname+"/public/index.html")
});
app.post("/register", async (req,res)=>{
    // res.send(req.body)
    let result = await userModel.findOne({email:req.body.email})
    if(!result){

        let {name,email,mobile,password}=req.body;

let solt= bcrypt.genSaltSync(10);
let hash=bcrypt.hashSync(password,solt);
password=hash;

obj={
    name:name,
    email:email,
    mobile:mobile,
    password:password
}
// console.log(hash)
     const data=await userModel.create(obj)
        // console.log(data)
     res.send(data)   
    }
    else{
        res.send("email already  exist.............")
        // console.log(data)
    }
     
})
// app.post("/setCookie", async (req,res)=>{
    
app.post("/login", async (req,res)=>{
    // console.log(req.body);

    const data=await userModel.findOne({email:req.body.email});
    let match=bcrypt.compareSync(req.body.password,data.password);
    console.log(match)
    let token;
    if(match==true){
        // console.log(data)
        token=jwt.sign({
            email:data.email,
            mobile:data.mobile,
            name:data.name,

        },"this is jasonwebtoken doing its work brilliantly")
        res.cookie("jwt",token,{maxAge:3600000});
        // res.send("set cookie data")
        res.redirect("/chat.html")
    }else{
        res.send("user is not found.....")
    }
}

)


app.get("/getcookie",(req,res)=>{
    


let match=jwt.verify(req.cookies.jwt,"this is jasonwebtoken doing its work brilliantly");
res.send(match)
})


// console.log(req.body)

// app.get("/logout",(req,res)=>{
//    res.clearCookie("jwt");
//    res.send("user logout")
// })
const io=require("socket.io")(http)
io.on('connection',(socket)=>{
    console.log("connected");
    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg)
    })
})
http.listen(port, () => {
    console.log(`server is running at port no ${port}`);
    // console.log(port)
})