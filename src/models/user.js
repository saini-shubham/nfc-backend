const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('Users',{
    name:{
        type:String,
        required:true,
        trim:true
    },
    adhaarNumber:{
        type:Number,
        trim:true,
        required:true,
        unique:true
    },
    firmName:{
        type:String,
        required:true,
        trim:true
    },
    city:[{
        type:String,
        required:true,
        enum:['Hisar','Sirsa','Pune','Delhi']
    }],
    phoneNumber:{
        type:Number,
        required:true,
        trim:true,
        unique:true 
    },
    userType:{
        type:String,
        required:true,
        trim:true,
        enum:['superAdmin','admin','tagger','scanner','visitor']
    },
    userId: String,
    password: String
} )

module.exports = User
