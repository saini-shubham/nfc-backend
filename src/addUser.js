const express = require("express");
const User = require("./models/user");
require("./db/mongoose");


try{
 // token =jwt.verify(token,config.secret);
 const user = new User({
    name:"admin",
    adhaarNumber:"123134234",
    firmName:"admin",
    city:"Hisar",
    phoneNumber:"8744821009",
    userType:"superAdmin",
    userId: "sadmin",
    password: "sadmin",
  }); // Save the user to the database
  const sUser = async()=>{
    await user.save();
    console.log("super user created")
  }
 sUser();
}
catch(err){
    console.log(err)
}