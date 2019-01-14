var mongoose = require('mongoose');
var Course = require('./course');

// Instrucor Schema
var InstructorSchema = mongoose.Schema({
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	username: {
		type: String
	},
	email: {
		type: String
	},
	courses:[{
		course_id: {type: mongoose.Schema.Types.ObjectId},
		course_title: {type: String}
	}]
});

InstructorSchema.statics.findInstructorByUsername = function(username, callback) {
	var query = {username: username};
	Instructor.findOne(query, callback);
}

// // Register Instructor for Class // MIGHT NO NEED THIS!!!!
// InstructorSchema.methods.register = function(info, callback) {
//     instructor_username = info['instructor_username'];
//     class_id = info['class_id'];
//     class_title = info['class_title'];
//
//     var query = {username: instructor_username};
//     Instructor.findOneAndUpdate(
//       query,
//       {$push: {"classes": {class_id: class_id, class_title: class_title}}},
//       {safe: true, upsert: true},
//       callback
//     );
// }

InstructorSchema.statics.createCourse = function(info, callback) {
	title = info['title'];
	description = info['description'];
	username = info['username'];

	var course = new Course({
		title,
		description,
		instructor: username
	});

	course.save(function(err, course) {
		if (err) throw err;
		var query = {username: username};
		Instructor.findOneAndUpdate(
			query,
			{$push: {"courses": {course_id: course._id, course_title: title}}},
			{safe: true, upsert: true},
			callback
		);
	});
}

InstructorSchema.statics.findCourses = function(user, callback) {
	console.log(user);
	Course.find({instructor: user.username}, function(err, courses) {
		if (err) throw err;
		callback(null, courses);
	});
}

var Instructor = module.exports = mongoose.model('instructor', InstructorSchema);
