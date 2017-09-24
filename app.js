const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('./models/user')


mongoose.connect("mongodb://localhost/auth_demo");


//middleWare
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: "I really love dodo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/locked', (req,res)=>{
    res.render('locked');
});


app.listen(port, ()=> {
    console.log('Express server is up on port ' + port);
});