var router = require('express').Router();

var Course = require('./../models/course.js');
var Instructor = require('./../models/instructor');
var User = require('./../models/instructor');
const ensureAuthenticated = require('./../middleware/ensureAuthenticated');
const { check, validationResult } = require('express-validator/check');

// router.get('/dashboard', ensureAuthenticated, function(req, res) {
//   // find instructor courses
//   console.log('instr get dashboard', req.user)
//   Instructor.findCourses(req.user, function(err, courses) {
//     if (err) throw err;
//     res.render('instructors/dashboard', {title: 'ELEARN | Dashboard', courses: courses});
//   });
// });
router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  // find instructor courses
  console.log('instr get dashboard', req.user)
  Instructor.findCourses(req.user).then((courses) => {
    res.render('instructors/dashboard', {title: 'ELEARN | Dashboard', courses: courses});
  }).catch(next);
});

router.get('/createCourse', ensureAuthenticated, (req, res) => {
  res.render('instructors/createCourse', {title: 'ELEARN | Create Course'});
});

router.post('/createCourse', ensureAuthenticated, [
  check('title').trim().not().isEmpty().withMessage('Title cannot be empty'),
  check('description').trim().not().isEmpty().withMessage('Description cannot be empty')
], (req, res, next) => {
  // Get Form Values
  var info = [];
	info['title'] = req.body.title;
  info['description'] = req.body.description;
  info['username'] = req.user.username;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    errors.array().forEach(function(error) {
      req.flash('error', error.msg);
    });
    res.redirect('/instructors/createCourse');
    return;
	}

  // Instructor.createCourse(info, function(err, instructor) {
  //   if(err) throw err;
	// 	console.log('Course created successfully', 'instructor obj follows. NEEDED?', instructor);
  // });
  // req.flash('info', 'Course created successfully');
	// res.redirect('/instructors/dashboard');
  Instructor.createCourse(info).then((instructor) => {
    console.log('Course created successfully', 'instructor obj follows. NEEDED?', instructor);
    req.flash('info', 'Course created successfully');
    res.redirect('/instructors/dashboard');
  }).catch(next);
});

router.get('/:courseId/createLesson', ensureAuthenticated, (req, res, next) => {
	res.render('instructors/createLesson', {title: 'ELEARN | Create Lesson', courseId: req.params.courseId});
});

router.post('/:courseId/createLesson', ensureAuthenticated, [
  check('lesson_number').trim().isInt().withMessage('Lesson number must be an integer'),
  check('lesson_title').trim().not().isEmpty().withMessage('Title cannot be empty'),
  check('lesson_body').trim().not().isEmpty().withMessage('Body cannot be empty')
], (req, res, next) => {
	// Get Values
	var info = [];
	info['courseId'] = req.params.courseId;
	info['lesson_number'] = req.body.lesson_number;
	info['lesson_title'] = req.body.lesson_title;
	info['lesson_body'] = req.body.lesson_body;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    errors.array().forEach(function(error) {
      req.flash('error', error.msg);
    });
    res.redirect(`/instructors/${info['courseId']}/createLesson`);
    return;
	}

	// Course.addLesson(info, function(err, course){
  //   if(err) throw err;
	// 	console.log('Lesson Added', 'course obj follows. NEEDED?', course);
	// });
  //
	// req.flash('info','Lesson ' + info['lesson_number'] + ' Added.');
	// res.redirect('/instructors/dashboard');
  Course.addLesson(info).then((course) => {
    console.log('Lesson Added', 'course obj follows. NEEDED?', course);
    req.flash('info','Lesson ' + info['lesson_number'] + ' Added.');
    res.redirect('/instructors/dashboard');
  }).catch(next);
});

// router.get('/modifyCourse/:courseId', ensureAuthenticated, function(req, res) {
//   var courseId = req.params.courseId;
//   Course.findCourseById(courseId, function(err, course) {
//     res.render('instructors/modifyCourse', { title: 'ELEARN | Modify Course', course: course });
//   });
// });
router.get('/modifyCourse/:courseId', ensureAuthenticated, (req, res, next) => {
  var courseId = req.params.courseId;
  Course.findCourseById(courseId).then((course) => {
    res.render('instructors/modifyCourse', { title: 'ELEARN | Modify Course', course: course });
  }).catch(next);
});

router.post('/modifyCourse/:courseId', [
  check('title').trim().not().isEmpty().withMessage('Title cannot be empty'),
  check('description').trim().not().isEmpty().withMessage('Description cannot be empty')
], ensureAuthenticated, (req, res, next) => {
  var info = [];
  info["courseId"] = req.params.courseId;
  info["newTitle"] = req.body.title;
  info["newDescription"] = req.body.description;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    errors.array().forEach(function(error) {
      req.flash('error', error.msg);
    });
    res.redirect(`/instructors/modifyCourse/${info['courseId']}`);
    return;
	}

  // Course.modifyCourse(info, function(err, course) {
  //   if(err) throw err;
  //   console.log('course modified.');
  // });
  // req.flash('info', 'Course successfully modified');
	// res.redirect('/instructors/dashboard');
  Course.modifyCourse(info).then((course) => {
    console.log('Course modified.');
    req.flash('info', 'Course successfully modified');
    res.redirect('/instructors/dashboard');
  }).catch(next);
});



module.exports = router;
