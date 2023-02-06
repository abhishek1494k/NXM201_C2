const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,enum:['user','manager'],default:'user'}
},
{
    versionKey:false
})

const UserModel=mongoose.model('users',userSchema)
module.exports={UserModel}