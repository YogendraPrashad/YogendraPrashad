const mongoose = require("mongoose");
let model=new mongoose.Schema({
    name:String,
    email:String,
    mobile:Number,
    password:String,
    
})
let userModel=mongoose.model("abc",model,"abc")
module.exports=userModel