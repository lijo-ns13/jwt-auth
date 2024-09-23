const express=require('express');

const noCache=require('nocache');
// 


const authRouter=require('./routes/authRoutes');
const homeRouter=require('./routes/homeRoutes');
const userRouter=require('./routes/userRoutes');
const adminRouter=require('./routes/adminRoutes')
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

const methodOverride = require('method-override');


const app=express();

app.use(methodOverride('_method'));

app.set('view engine','ejs');
app.use(noCache())
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))

// app.use(homeRouter)
app.use(authRouter)
app.use(userRouter)
app.use(adminRouter)


module.exports=app;