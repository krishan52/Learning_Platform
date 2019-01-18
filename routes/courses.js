var router = require('express').Router();

var Course = require('./../models/course');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');

// GET course details
// router.get('/:id/details', (req, res) => {
//   var courseId = req.params.id;
//   Course.findCourseById(courseId, function(err, course) {
//     if (err) throw err;
//     res.render('courses/details', { title: 'ELEARN | Details', course: course });
//   });
// });
router.get('/:id/details', (req, res, next) => {
  var courseId = req.params.id;
  Course.findCourseById(courseId).then((course) => {
    res.render('courses/details', { title: 'ELEARN | Details', course: course });
  }).catch(next);
});

// Get Lesson
// router.get('/:courseId/lessons/:lesson_id', ensureAuthenticated, function(req, res, next) {
//   Course.findCourseById([req.params.courseId], function(err, course) {
//     var thisLesson;
//     console.log('COURSE.LESSONS', course.lessons);
// 		course.lessons.forEach(function(lesson) {
//       if (lesson._id == req.params.lesson_id) {
//         thisLesson = lesson;
//         console.log('THELESSON!!', thisLesson);
//       }
//     })
// 		res.render('courses/lesson', { title: 'ELEARN | Lesson', course: course, lesson: thisLesson });
// 	});
// });
router.get('/:courseId/lessons/:lesson_id', ensureAuthenticated, (req, res, next) => {
  Course.findCourseById([req.params.courseId]).then((course) => {
    var lesson = course.lessons.filter(lesson => lesson._id == req.params.lesson_id)[0];
    res.render('courses/lesson', { title: 'ELEARN | Lesson', course: course, lesson: lesson });
  }).catch(next);
});

// GET all courses
// router.get('/all', function(req, res) {
//   Course.findCourses(function(err, courses) {
//     if (err) throw err;
//     res.render('courses/all', { title: 'ELEARN | All Courses', courses: courses });
//   });
// });
router.get('/all', (req, res, next) => {
  Course.findCourses().then((courses) => {
    res.render('courses/all', { title: 'ELEARN | All Courses', courses: courses });
  }).catch(next);
});

module.exports = router;
