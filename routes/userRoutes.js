const express=require('express');
const userModel=require('../models/userSchema')
const router=express.Router();
const JWT=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {jwtAuth,adminProtected,userProtected}=require('../middlewares/jwtAuth');

router.get('/',jwtAuth,userProtected,async(req,res)=>{
    const user=await userModel.findById(req.user._id)
    res.render('protected',{user:user}) 
})

module.exports=router;