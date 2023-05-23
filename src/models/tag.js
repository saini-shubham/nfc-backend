const mongoose = require('mongoose')
const validator = require('validator')

const Tag = mongoose.model('Tag',{
    name:{
        type:String,
        required:true,
        trim:true
    },
    houseNo:{
        type:String,
        required:true,
        trim:true
    },
    locality:{
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    state:{
        type:String,
        required:true,
        trim:true
    },
    pincode:{
        type:Number,
        required:true
    },
    phoneNo:{
        type:Number,
        required:false,
        trim:true
    },
    tagId:{
        type:String,
        required:true,
        trim:true,
        unique:true  

    },
    userId:{
        type:String,
        required:true,
        trim:true
    },
    registryDateTime:{
        type:Date,
        default:Date.now() + 7*24*60*60*1000

    },
    scanned: Boolean

})


module.exports = Tag