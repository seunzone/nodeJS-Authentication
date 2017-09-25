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
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: "I really love dodo",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============ROUTES=================

app.get('/', (req,res)=>{
    res.render('home');
});

app.get('/locked', isLoggedIn, (req,res)=>{
    res.render('locked');
});

//===========AuthROutes===========
app.get('/register', (req,res)=>{
    res.render('register');
});

app.post('/register', (req,res)=>{
    // res.send('Post Route');
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, (err,user)=>{
        if(err){
            console.log(err)
            res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/locked");
        });
    });
});

//===============Login Routes=========
app.get('/login', (req,res)=>{
    res.render('login');
});

app.post('/login',passport.authenticate('local', {
    successRedirect:'/locked',
    failureRedirect:'login'
}),(req,res)=>{
});

//==========Logout Route=========
app.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(port, ()=> {
    console.log('Express server is up on port ' + port);
});