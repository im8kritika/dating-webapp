require("./Passport.js");
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const User = require('./models/user.js');

app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

let db;

function isLoggedIn(req, res, next) {
  console.log(req.user); // Add this line
  req.user ? next() : res.sendStatus(401);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
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
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get("/protected/", (req, res) => {
  res.send("Hello!");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", isLoggedIn, (req, res) => {
  res.send("Something went wrong");
});

app.get("/auth/protected", isLoggedIn, (req, res) => {
  console.log("Accessing /auth/protected");
  console.log(req.user);
  console.log(req.user);
  let name = req.user.displayName;
  let picture =
    req.user.photos && req.user.photos.length > 0
      ? req.user.photos[0].value
      : "default_picture_url";
  res.redirect(
    `http://localhost:3001/success?name=${encodeURIComponent(
      name
    )}&picture=${encodeURIComponent(picture)}`
  );
});
app.post('/api/users/birthdate', async (req, res) => {
  const { birthdate } = req.body;

  // Here you can handle the birthdate, for example, save it to your database
  // using the User model

  try {
    const user = new User({ birthdate });
    await user.save();

    res.status(200).send({ message: 'Birthdate saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while saving the birthdate' });
  }
});

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("Connected successfully to MongoDB server"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

app.listen(3000, () => console.log("App listening on port 3000!"));
