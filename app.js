// Load environment variables from .env file
require('dotenv').config(); 
// Import necessary packages
const express = require('express');
const cookieParser = require('cookie-parser');//To get the cookie from the browser
const passport=require('passport'); //Require the passport

//Importing the express-session and the flash
const session=require('express-session');
const flash=require('connect-flash');

// Import routes from the 'routes' folder
const homeRoutes = require("./routes/homeRoutes.js");
const blogRoutes=require("./routes/blogRoutes.js");
const authRoutes=require("./routes/authRoutes.js");
const { decode } = require('jsonwebtoken');
const { decryptToken } = require('./service/decryptToken.js');
// Create an Express application instance
const app = express();
const portNumber = 3000;
// Set up the view engine to use EJS for rendering templates
app.set('view engine', 'ejs');

// Middleware to serve static files (e.g., CSS, images)
app.use(express.static('public'));
app.use(express.static('public/css/'));
app.use(express.static('public/images'));
// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));
//Middleware To Get the Cookie
app.use(cookieParser());

//To check whether the user is logged in or not
app.use(async(req,res,next)=>{
      res.locals.isLoggedIn=req.cookies.token;
      const token=req.cookies.token;
      if(token){
            const decoded=await decryptToken(token,process.env.JWT_SECRET);
            if(decoded && decoded.id){
            res.locals.currentuserId=decoded.id;
      }
    }
      next();
 });

// Defining the express-session and the flash
app.use(session({
      secret:process.env.SESSION_SECRET,
      resave:false,
      saveUninitialized:false
}));
app.use(flash());
//SetUp the passport
app.use(passport.initialize());
app.use(passport.session());

// Routing
app.use('', homeRoutes);
app.use('',blogRoutes);
app.use('',authRoutes);
// Start the server on port 3000
app.listen(3000, () => {
    console.log(`Server is running on port${portNumber}`);
});