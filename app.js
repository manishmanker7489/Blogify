require('dotenv').config();
const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');

const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const userRouter = require('./routes/user');
const blogroute=require('./routes/blog');

const Blog = require('./model/blog');

//db connection..
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then((e)=> console.log("Mongo DB Connect") );


const app = express();

app.set("view engine" , "ejs");
app.set("views" , path.resolve('./views'));

app.use( express.urlencoded({ extended:false }) )
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));

app.get("/", async(req,res)=>{
    const allBlogs = await Blog.find({}).populate('createdBy') ;
    res.render('home',{ user: req.user , blogs:allBlogs });
}) 

app.use('/user', userRouter);
app.use("/blog",blogroute); 

const  PORT = process.env.PORT || 8000;

app.listen(PORT,()=> console.log(`Server is Started at PORT ${PORT}`) );