const mongoose = require('mongoose')
const validator = require('validator')
const TagReport = mongoose.model('TagReport',{
    name:{
        type:String,
       // required:true,
        trim:true
    },
    tagId:{
        type:String,
        required:true,
        trim:true,
        //unique:true  

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
        trim:true,
        //enum:['hisar','sirsa','gurgaon','pune','hyd']
    },
    scanned:{
        type:Boolean,
        default:false
    },
    userId:{
        type:String,
        //required:true
    },
    date:String,
    time:String

})

module.exports = TagReport;