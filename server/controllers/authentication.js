const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // sub: subject of the token. iat: issued at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
  // User has already been auth'd
  // Give them a token
  res.send({token: tokenForUser(req.user)});
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) return res.status(422)
    .send({error: 'Must provide email and password'});

  // See if a user with the provided email exists.
  User.findOne({ email }, function(err, existingUser) {
    // 422: unprocessable entity. Can't proceed with provided data.
    if (existingUser) return res.status(422)
    // If you find such user, set status to 422 and send a message why.
      .send({error: 'Email in use'});

    // If there's no user with that email, save it to the db
    const user = new User({ email, password });
    user.save(function(err) {
      if (err) return next(err);
      res.json({token: tokenForUser(user)});
    });
  });
};