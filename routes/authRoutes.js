const express=require('express');
const userModel=require('../models/userSchema')
const router=express.Router();
const JWT=require('jsonwebtoken');
const bcrypt=require('bcrypt');


router.get('/signin',(req,res)=>{
    res.render('signin');
})
router.post('/signin',async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({success:false,message:"Please fill in all fields"});
        }
        const user=await userModel.findOne({email}).select('+password');
        if (!user || !await bcrypt.compare(password,user.password)) {
            return res.status(400).json({ success: false, message: "User not found or password not matching" });
        }
     
        const token=JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'24h'})
        user.password=undefined;
        const cookieOptions={
            maxAge:24*60*60*1000,
            httpOnly:true
        };
        console.log("logged in")
        res.cookie("token",token,cookieOptions);
        console.log('login')
        res.json({success:true,message:'login successful',role:user.role,token})
        
        
    }catch(error){
        return res.status(400).json({success:false,message:error.message,m:'ii'})
    }
    
})
router.get('/signup',(req,res)=>{
    res.render('signup');
})
router.post('/signup',async(req,res)=>{
    
    try{
        const {name,email,password,confirmPassword}=req.body;
    if(!name||!email||!password||!confirmPassword){
        return res.status(400).json({success:false,message:"Please fill in all fields"});
    }
    if(password!==confirmPassword){
        return res.status(400).json({success:false,message:"Passwords do not match"});
    }
    const regex=/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
    let result = regex.test(email);
    if(!result){
        return res.status(400).json({success:false,message:"Invalid email"});
    }
    const validUsername = /^[0-9A-Za-z]{6,16}$/;
    let result2 = validUsername.test(name);
    if(!result2){
        return res.status(400).json({success:false,message:"Invalid username,minimum 6 characters "});
    }
    const userInfo=userModel(req.body)
    const user=await userInfo.save();
    res.status(201).json({success:true,message:"User created successfully",user:user});
    }catch(error){
        if(error.code===11000){
            return res.status(400).json({success:false,message:"Email already exists"});
        }
        return res.status(400).json({success:false,message:error.message})
    }

})

router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    // res.status(200).json({success:true,message:'loggged out successfully'})
    res.status(200).redirect('/signin')
})
module.exports=router;