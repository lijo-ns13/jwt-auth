const express=require('express');
const databaseConnect=require('./config/databaseConnect')
const app=require('./app');

databaseConnect()
app.listen(3001,()=>{
    console.log('running on 3001')
})