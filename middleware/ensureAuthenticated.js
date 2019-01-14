function ensureAuthenticated(req, res, next) {
  // A function provided by Passport
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page.");
    res.redirect("/users/login");
  }
}

module.exports = ensureAuthenticated;
