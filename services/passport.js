const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id); //id is the id assigned to the record
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(existingUser => {
        //existingUser is model instance for whom we searched
        if (existingUser) {
          //we already have a user with this googleId
          done(null, existingUser); //1st argument is for err and 2nd is for user record
        } else {
          new User({ googleId: profile.id })
            .save() //creates a new instance of user
            .then(user => done(null, user));
        }
      });
    }
  )
);
