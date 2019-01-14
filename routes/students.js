var router = require('express').Router();

var Course = require('./../models/course.js');
var Student = require('./../models/student');
var User = require('./../models/instructor');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

router.get('/dashboard', ensureAuthenticated, function(req, res,) {
  Student.findCoursesFull(req.user, function(err, courses) {
    if (err) throw err;
    res.render('students/dashboard', {title: 'ELEARN | Dashboard', courses: courses});
  });
});

router.post('/course/register', ensureAuthenticated, function(req, res) {
	info = [];
	info['student_username'] = req.body.student_username;
	info['course_id'] = req.body.course_id;
	info['course_title'] = req.body.course_title;

	Student.register(info, function(err, student){
		if(err) throw err;
		console.log(student);
	});

	req.flash('info', 'You are now registered for the course.');
	res.redirect('/students/dashboard');
});

router.get('/:courseId/viewLessons', ensureAuthenticated, function(req, res) {
  var courseId = req.params.courseId;

  Course.findCourseById(courseId, function(err, course) {
    res.render('students/viewLessons', {title: 'ELEARN | Lessons', course: course});
  });
});


module.exports = router;
