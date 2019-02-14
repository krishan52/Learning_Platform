/*
  serializeUser saves the user id into session:
  req.session.passport.user = {id: user._id}

  deserializeUser finds the user by id and attaches the user object to the request as req.user
  req.user = user
*/

const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;


module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

};

/*
  1. Look for a user with the supplied username.
  2. If no user exists, then your user isn’t authenticated
  3. If the user does exist, compare their real password with the password you supply.
  If the password matches, return the current user. If it doesn’t, return “Invalid password.”
*/

passport.use('login', new LocalStrategy(function(username, password, done) {
  User.findOne({username: username}).then((user) => {
    if (!user) {
      return done(null, false, { message: 'No user has that username!' }); // qui l'uso di return??
    }
    user.checkPassword(password).then((isMatch) => {
      if (isMatch) {
        return done(null, user);
      }
      done(null, false, { message: 'Invalid password.' });
    }).catch((err) => {
      return done(err);
    });
  });
}));
