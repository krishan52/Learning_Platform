var express = require("express");
var passport = require("passport");
var User = require("./models/user");
var router = express.Router();




function ensureAuthenticated(req, res, next) {
  // A function provided by Passport
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/login");
  }
}

router.get("/edit", ensureAuthenticated, function(req, res) {
  // middleware call next only if user is authenticated, otherwise it redirects to /login
  // and execution never gets here
  res.render("edit");
});

// Normally, this would be a PUT request, but browsers support only GET and POST in HTML forms.
router.post("/edit", ensureAuthenticated, function(req, res, next) {
  req.user.displayName = req.body.displayname;
  req.user.bio = req.body.bio;
  req.user.save(function(err) {
    if (err) {
      next(err);
      return;
    }
    req.flash("info", "Profile updated!");
    res.redirect("/edit");
  });
});


module.exports = router;
