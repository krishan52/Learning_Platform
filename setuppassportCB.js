/* In app.js

To initialize Passport, you’ll need to set up three official Express middlewares, a third-
party middleware, and then two Passport middlewares. For your reference, they’re
listed here:
body-parser  —parses HTML forms
cookie-parser  —handles the parsing of cookies from browsers and is required for user sessions
express-session  —Stores user sessions across different browsers
connect-flash  —Shows error messages
passport.initialize  —Initializes the Passport module (as you’ll learn)
passport.session  —Handles Passport sessions (as you’ll learn)
*/

/*
Because all of your user models have a unique _id property, you’ll use that as your translation.
First, make sure you require your user model.
Next, instruct Passport how to serialize and deserialize users from their ID , as in the next listing.
This code (when required) can be placed before or after the Passport middleware; place it where you’d like.
(in app.js!!)
*/

/*
serializeUser saves the user id into session:
req.session.passport.user = {id: user._id}

deserializeUser finds the user by id and attaches the user object to the request as req.user
req.user = user
*/

var passport = require("passport");
var User = require("./models/user");

var LocalStrategy = require("passport-local").Strategy;


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
The final part of Passport is setting up a strategy. Some strategies include authentica-
tion with sites like Facebook or Google; the strategy you’ll use is a local strategy. In
short, that means the authentication is up to you, which means you’ll have to write a
little Mongoose code.
First, require the Passport local strategy into a variable called LocalStrategy , as in
the following listing.
*/

/*
First, require the Passport local strategy into a variable called LocalStrategy.
Next, tell Passport how to use that local strategy. Your authentication code will run
through the following steps:
1. Look for a user with the supplied username.
2. If no user exists, then your user isn’t authenticated; say that you’ve finished with
the message “No user has that username!”
3. If the user does exist, compare their real password with the password you supply.
If the password matches, return the current user. If it doesn’t, return “Invalid password.”
*/

passport.use("login", new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: "No user has that username!" });
    }
    user.checkPassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid password." });
      }
    });
  });

}));

/*
As you can see, you instantiate a LocalStrategy . Once you’ve done that, you call the
done callback whenever you’re done! You’ll return the user object if it’s found and false otherwise.
*/
