const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));


require("./Passport.js");
require("dotenv").config();

function isLoggedIn(req, res, next) {
  req.user ? next(): res.sendStatus(401);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{secure:false}
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("/", function (req, res) {
 res.send('<a href="/auth/google">Authenticate with Google</a>')
});

app.get('/protected/',(req, res) => {   
    res.send('Hello!')
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
    successRedirect: "/auth/protected",
    failureRedirect: '/auth/google/failure' ,
  })   
);

app.get('/auth/google/failure',isLoggedIn,(req,res)=>{
    res.send('Something went wrong');
});

app.get('/auth/protected',isLoggedIn,(req,res)=>{
    let name= req.user.displayName;
    let picture = req.user.photos[0].value;
    res.redirect(`http://localhost:3001/success?name=${encodeURIComponent(name)}&picture=${encodeURIComponent(picture)}`);
});

app.listen(3000, () => console.log("App listening on port 3000!"));
