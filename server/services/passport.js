const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');

// create local strategy
const localLogin = new LocalStrategy({ usernameField: 'email' }, // we don't have username, we have email.
  function (email, password, done) {
    // verify email and password
    // call done with the user if correct
    // call done with no user if not
    User.findOne({email}, function (err, user) {
      if (err) return done(err);

      // user not found:
      if (!user) return done(false);

      // compare passwords (hash submitted pw, and see if it's the same in Mongo)
      user.comparePassword(password, function (err, isMatch) {
        if (err) return done(err);
        if (!isMatch) return done(null, false);
        return done(null, user);
      })
    })
  }
);

// setup options for JWT strategy
const jwtOptions = {
  // Look for the token at the header, in a property called authorization
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // Use this secret to decode the token
  secretOrKey: config.secret
};

// Create JWT strategy
/*
 * @payload: JWT token with the sub and iat properties defined in authentication.js
 * @done: callback
 */
const jwtlogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user.id in payload exists in Mongo
  // remember the .sub was defined as the user.id
  User.findById(payload.sub, function(err, user) {
    // If there's an error in the search, done, send the error with no user
    if (err) return done(err, false);

    // If it does, call 'done' with that user
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this strategy
passport.use(jwtlogin);
passport.use(localLogin);