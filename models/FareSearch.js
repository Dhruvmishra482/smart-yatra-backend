const mongoose=require("mongoose")

const fareSearchSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    from:{
        type:String,
        required:true,

    },
    to:{
        type:String,
        required:true,
    },
    transportMode:{
        type:String,
    },
    classType:{
        type:String,
    },

    fareResult:{
        type:mongoose.Schema.Types.Mixed,
    },
    createdAt:{
    type:Date,
    default:Date.now,
    }
})

module.exports=mongoose.model("fareSearch",fareSearchSchema)