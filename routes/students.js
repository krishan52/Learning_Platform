var router = require('express').Router();

var Course = require('./../models/course.js');
var Student = require('./../models/student');
var User = require('./../models/instructor');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

// router.get('/dashboard', ensureAuthenticated, function(req, res,) {
//   Student.findStudentCourses(req.user, function(err, courses) {
//     if (err) throw err;
//     res.render('students/dashboard', {title: 'ELEARN | Dashboard', courses: courses});
//   });
// });
router.get('/dashboard', ensureAuthenticated, function(req, res, next) {
  Student.findStudentCourses(req.user).then((courses) => {
    res.render('students/dashboard', {title: 'ELEARN | Dashboard', courses: courses});
  }).catch(next);
});

// router.post('/course/register', ensureAuthenticated, function(req, res) {
// 	info = [];
// 	info['student_username'] = req.body.student_username;
// 	info['course_id'] = req.body.course_id;
// 	info['course_title'] = req.body.course_title;
//
// 	Student.register(info, function(err, student){
// 		if(err) throw err;
// 		console.log(student);
// 	});
//
// 	req.flash('info', 'You are now registered for the course.');
// 	res.redirect('/students/dashboard');
// });
router.post('/course/register', ensureAuthenticated, function(req, res, next) {
	info = [];
	info['student_username'] = req.body.student_username;
	info['course_id'] = req.body.course_id;
	info['course_title'] = req.body.course_title;

	Student.register(info).then((student) => {
    console.log(student);
    req.flash('info', 'You are now registered for the course.');
    res.redirect('/students/dashboard');
  }).catch(next);
});

// QUANDO UTILIZZO STA ROUTE???????????????? /students/courseID/viewLessons
// router.get('/:courseId/viewLessons', ensureAuthenticated, function(req, res) {
//   var courseId = req.params.courseId;
//
//   Course.findCourseById(courseId, function(err, course) {
//     res.render('students/viewLessons', {title: 'ELEARN | Lessons', course: course});
//   });
// });
router.get('/:courseId/viewLessons', ensureAuthenticated, function(req, res, next) {
  var courseId = req.params.courseId;

  Course.findCourseById(courseId).then((course) => {
    res.render('students/viewLessons', {title: 'ELEARN | Lessons', course: course});
  }).catch(next);
});


module.exports = router;
