var router = require('express').Router();

var Course = require('./../models/course');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

// // GET classes page
// router.get('/', function(req, res, next) {
//   Class.getClasses(function(err, classes) {
//     if (err) throw err;
//     res.render('classes/index', { classes: classes });
//   }, 3);
// });

// GET course details
router.get('/:id/details', function(req, res, next) {
  var courseId = req.params.id;
  Course.findCourseById(courseId, function(err, course) {
    if (err) throw err;
    res.render('courses/details', { title: 'ELEARN | Details', course: course });
  });
});

// // Get Lessons
// router.get('/:id/lessons', ensureAuthenticated, function(req, res, next) {
// 	Class.getClassById([req.params.id], function(err, classname){
// 		if(err) throw err;
// 		res.render('classes/lessons', { title: 'ELEARN | Lessons', class: classname });
// 	});
// });

// Get Lesson
router.get('/:courseId/lessons/:lesson_id', ensureAuthenticated, function(req, res, next) {
	// Course.findCourseById([req.params.courseId], function(err, course){
	// 	var lesson;
	// 	if (err) throw err;
	// 	for (i = 0; i < course.lessons.length; i++){
	// 		if (course.lessons[i].lesson_number == req.params.lesson_id){
	// 			lesson = course.lessons[i];
	// 		}
	// 	}
	// 	res.render('course_lesson', { course: course, lesson: lesson });
	// });
  Course.findCourseById([req.params.courseId], function(err, course) {
    var thisLesson;
		course.lessons.forEach(function(lesson) {
      if (lesson._id == req.params.lesson_id) {
        thisLesson = lesson;
      }
    })
		res.render('courses/lesson', { title: 'ELEARN | Lesson', course: course, lesson: thisLesson });
	});

});

router.get('/all', function(req, res) {
  Course.findCourses(function(err, courses) {
    if (err) throw err;
    res.render('courses/all', { title: 'ELEARN | All Courses', courses: courses });
  });
});

module.exports = router;
