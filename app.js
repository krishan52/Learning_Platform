const createError = require('http-errors');
const express = require("express");
const mongoose = require("mongoose");
// Connects to your MongoDB server in the test database
mongoose.connect("mongodb://localhost:27017/learnAboutMe", { useNewUrlParser: true }); // change the name here!!!!!!!!!!!!!!!!!!
const path = require("path");
const logger = require('morgan');
//const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressValidator = require('express-validator');
const flash = require("connect-flash");
const passport = require("passport");

// single funtion that will set up passport stuff
var setUpPassport = require("./setuppassport");
// // Puts all of your routes in another file
// var routes = require("./routes"); // why no error for this!!!!!!!!!!!!!!!!!!!!!!!!!!!
// console.log('!', routes);
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentsRouter = require('./routes/students');
var instructorsRouter = require('./routes/instructors');
var coursesRouter = require('./routes/courses');

// set up passport
setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  // allows each session to be encrypted from the clients. This deters hackers from hacking into users’ cookies. As noted, it needs to be a bunch of random characters.
  secret: "TKRv0IJsHYqrvagQ#&!F!%V]Ww/4KiVs$s<<MX",
  // option required by the middleware. When it’s set to true , the session will be updated even when it hasn’t been modified.
  resave: true,
  // another required option. This resets sessions that are uninitialized.
  saveUninitialized: true
}));
// Initializes the Passport module and Handles Passport sessions
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
  res.locals.errorMessages = req.flash('error');
  res.locals.infoMessages = req.flash('info');
  next();
});

// Sets useful variables for your templates
// Passport will populate req.user and connect-flash will populate some flash values.
app.use(function(req, res, next) {
  // Every view will have access to currentUser, which pulls from req.user, which is populated by Passport.
  res.locals.currentUser = req.user;
  if(req.user) {
    res.locals.type = req.user.type;
  }
  next();
});

// // for test, TO DELETE
// app.use((req, res, next) => {
//   console.log('***REQ.COOKIES: ', req.cookies);
//   console.log('***REQ.BODY: ', req.body);
//   console.log('***REQ.SESSION: ', req.session);
//   next();
// });

// ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/students', studentsRouter);
app.use('/instructors', instructorsRouter);
app.use('/courses', coursesRouter);
// app.use(routes); // delete!!!!!!!!!!!!!!!!!!!!!!!


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('INSIDE error handler in app.js');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'ELEARN | Error!' });
});

app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
