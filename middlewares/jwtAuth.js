const jwt = require('jsonwebtoken');
const userModel=require('../models/userSchema');
const dotenv=require('dotenv').config()
const cookieParser=require('cookie-parser')
exports.jwtAuth=async(req,res,next)=>{
    const token = (req.cookies && req.cookies.token) || null;
    console.log("Token:", token);

    if (!token) {
        console.log("No token provided"); 
        
        return res.status(401).json({ success: false, message: "You are not authorized to access this resource." });
        // res.redirect('/signin')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Payload:", payload); 
        req.user = { _id: payload._id };
        const user=await userModel.findById(payload._id);
        req.user.role=user.role;
        
        next();
    } catch (e) {
        // console.log("Token verification error:", e); 
        // return res.status(400).json({
        //     success: false,
        //     message: e.message
        // });
        res.redirect('/signin')
    }
    
}

exports.adminProtected=async(req,res,next)=>{

    const token = (req.cookies && req.cookies.token) || null;
    if(!token){
        return res.status(401).json({success:false,message:'Unauthorized'})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const userInfo=await userModel.findById(decoded.id);
        
        if (req.user.role === 'admin') {
            next()
        }
        
    }catch(error){
        return res.status(400).json({success:false,message:error.message})
    }
}
exports.userProtected=async(req,res,next)=>{

    const token = (req.cookies && req.cookies.token) || null;
    if(!token){
        return res.status(401).json({success:false,message:'Unauthorized'})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const userInfo=await userModel.findById(decoded.id);
        
        if (req.user.role === 'user') {
            next()
        }
        
    }catch(error){
        return res.status(400).json({success:false,message:error.message})
    }
}