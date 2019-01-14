// get register OK
// post register
//
// passport: serialize, deserialize, LocalStrategy
//
// get login
// post login
//
// get logout

const router = require("express").Router();
const passport = require("passport");
const User = require("./../models/user");
// Include Student Model
var Student = require('../models/student');
// Include Instructor Model
var Instructor = require('../models/instructor');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');
const { check, validationResult } = require('express-validator/check');

// GET signup
router.get("/signup", function(req, res) {
  res.render("users/signup", {title: 'ELEARN | Sign up'});
});

// POST signup + login
router.post("/signup", [
  // Form Validation
	check('first_name', 'First name field is required').not().isEmpty(),
	check('last_name').not().isEmpty().withMessage('Last name field is required'),
	check('email').not().isEmpty().withMessage('Email field is required'),
	check('email').isEmail().withMessage('Email must be a valid email address'),
	check('username').not().isEmpty().withMessage('Username field is required'),
	check('password').not().isEmpty().withMessage('Password field is required'),
	// check('password2').equals(req.body.password).withMessage('Passwords do not match')
  check('password2').custom((value, {req}) => {return value == req.body.password;}).withMessage('Passwords do not match')
], function(req, res, next) {
  // Get Form Values
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var type = req.body.type;

	// errors = req.validationErrors();
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    errors.array().forEach(function(error) {
      req.flash('danger', error.msg);
    });
    res.redirect('/users/signup');
    return;
	}

  // Calls findOne to return just one user. You want a match on usernames here.
  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    // If you find a user, you should bail out because that username already exists.
    if (user) {
      req.flash('danger', 'User already exists');
      res.redirect('/users/signup');
      return;
    }
    // Creates a new instance of the User model with the username and password and type
    var newUser = new User({
      email: email,
      username:username,
      password: password,
      type: type
    });

    if(type == 'student'){
      console.log('Registering Student...');

      var newStudent = new Student({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username:username
      });

      User.saveStudent(newUser, newStudent, function(err, user){
        if (err) {
          console.log(err);
          throw err;
        }
        console.log('Student created');
        req.flash('success', 'User Added');
        next();
      });
    } else {
      console.log('Registering Instructor...');
      var newInstructor = new Instructor({
        first_name: first_name,
        last_name: last_name,
        email: email,
        username: username
      });

      User.saveInstructor(newUser, newInstructor, function(err, user){
        console.log('Instructor created');
        req.flash('success', 'User Added');
        next();
      });
    }
  });
},
// after signup, do login
passport.authenticate('login', {
  // Authenticates the user
  successRedirect: '/dashboard',
  failureRedirect: '/users/signup',
  failureFlash: true
}));

// GET login
router.get("/login", function(req, res) {
  res.render("users/login", {title: 'ELEARN | Login'});
});

// POST login
// passport.authenticate returns a request handler function that you pass instead one you write yourself.
// This lets you redirect to the right spot, depending on whether the user successfully logged in.
router.post("/login", passport.authenticate("login", {
  successRedirect: "/dashboard",
  failureRedirect: "/users/login",
  // Sets an error message with connect-flash if the user fails to log in
  failureFlash: true
}));

// GET logout
router.get("/logout", function(req, res) {
  // function added to req by passport
  req.logout();
  req.flash("success", "You've been logged out");
  res.redirect("/");
});

// GET users/:username
router.get("/:username", ensureAuthenticated, function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    if (user.type == 'student') {
      Student.findStudentByUsername(user.username, function(err, student) {
        res.render("users/profile", { title: 'ELEARN | Profile', fullUser: student });
      });
    } else {
      Instructor.findInstructorByUsername(user.username, function(err, instructor) {
        res.render("users/profile", { title: 'ELEARN | Profile', fullUser: instructor });
      });
    }
  });
});

router.get("/:username/edit", ensureAuthenticated, function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render("users/edit", { title: 'ELEARN | Edit Profile', user: user });
  });
});




module.exports = router;
