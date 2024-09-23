const express=require('express');
const userModel=require('../models/userSchema')
const router=express.Router();
const JWT=require('jsonwebtoken');
const bcrypt=require('bcrypt');

router.get('/',(req,res)=>{
    res.render('home')
})

module.exports=router;