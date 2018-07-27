const authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.get('/', requireAuth, function (req, res) {
    res.send({ success: 'If you see this, you\'re authenticated'})
  });

  app.post('/signin', requireSignin, authentication.signin);
  app.post('/signup', authentication.signup);
};