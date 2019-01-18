const router = require('express').Router();
const Course = require("./../models/course");
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

// router.get("/", function(req, res, next) {
//   Course.findCourses(function(err, courses) {
//     if (err) throw err;
//     res.render('index', { title: 'ELEARN | Home', courses: courses });
//   });
// });
router.get("/", (req, res, next) => {
  Course.findCourses().then((courses) => {
    res.render('index', { title: 'ELEARN | Home', courses: courses });
  }).catch(next);
});

router.get("/dashboard", ensureAuthenticated, function(req, res) {
  res.redirect(`${req.user.type}s/dashboard`);
});

module.exports = router;
