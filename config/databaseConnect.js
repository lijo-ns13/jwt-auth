const mongoose=require('mongoose');
const dotenv=require('dotenv').config()
const MONGODB_URL=process.env.MONGODB_URL || 'mongodb://localhost:27017/work';

const databaseConnect=()=>{
    mongoose
        .connect(MONGODB_URL)
        .then((conn)=>{console.log(`connected to ${conn.connection.host}`)})
        .catch((e)=>console.log(e))
}

module.exports=databaseConnect;