const express=require('express');
const userModel=require('../models/userSchema')
const router=express.Router();
const JWT=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {jwtAuth,adminProtected,userProtected}=require('../middlewares/jwtAuth');


router.get('/dashboard',jwtAuth,adminProtected,async(req,res)=>{
    const users=await userModel.find({role:'user'});
    
    res.render('dashboard',{users})
})
router.get('/adduser',jwtAuth,adminProtected,(req,res)=>{
    res.render('adduser')
})
router.post('/adduser',jwtAuth,adminProtected,async(req,res)=>{
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
    res.status(201).json({success:true,message:"User added successfully",user:user});
    }catch(error){
        if(error.code===11000){
            return res.status(400).json({success:false,message:"Email already exists"});
        }
        return res.status(400).json({success:false,message:error.message})
    }
})
router.get('/updateuser/:id',async(req,res)=>{
    const id=req.params.id;
    const user=await userModel.findById(id);
    res.render('updateuser',{_id:req.params.id,user:user})
})
router.patch('/updateuser/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        const {name,email}=req.body;
        const user=await userModel.findByIdAndUpdate(id,{name,email},{new:true})
        res.status(200).json({success:true,message:'successfully updated'})
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

router.post('/deleteuser/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      
      
        await userModel.findByIdAndDelete(userId);
      
      
      res.redirect('/dashboard'); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting user');
    }
  });
router.get('/search',jwtAuth, adminProtected, async (req, res) => {
    const { query } = req.query;

    try {
        const users = await userModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });
        

        res.render('searchResults', { users });
    } catch (error) {
        res.status(500).send('Error searching for users');
    }
});
module.exports=router;