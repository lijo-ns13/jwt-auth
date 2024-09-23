const mongoose=require('mongoose');
const { Schema }=mongoose;
const dotenv=require('dotenv').config()
const JWT=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const userSchema=new Schema({
    name:{
        type:String,
        required:[true,'enter name'],
        trim:true,
        maxlength:[20,'name cannot exceed 20 characters'],
        minlength:[6,'minimum 6 characters'],

    },
    email:{
        type:String,
        required:[true,'email required'],
        unique:[true,'already registred'],
        lowercase:true,
        trim:true
        
    },
    password:{
        type:String,
        select:false

    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},{
    timestamps:true
})
userSchema.pre('save',async function(next){
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const userModel=mongoose.model('user',userSchema);
module.exports=userModel;