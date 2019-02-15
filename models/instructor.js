const mongoose = require('mongoose');
const Course = require('./course');

// Instrucor Schema
const InstructorSchema = mongoose.Schema({
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

// InstructorSchema.statics.findInstructorByUsername = function(username, callback) {
// 	var query = {username: username};
// 	Instructor.findOne(query, callback);
// }
InstructorSchema.statics.findInstructorByUsername = (username) => {
	return Instructor.findOne({username: username});
}

// InstructorSchema.statics.createCourse = function(info, callback) {
// 	title = info['title'];
// 	description = info['description'];
// 	username = info['username'];
//
// 	var course = new Course({
// 		title,
// 		description,
// 		instructor: username
// 	});
//
// 	course.save(function(err, course) {
// 		if (err) throw err;
// 		var query = {username: username};
// 		Instructor.findOneAndUpdate(
// 			query,
// 			{$push: {"courses": {course_id: course._id, course_title: title}}},
// 			{safe: true, upsert: true},
// 			callback
// 		);
// 	});
// }
InstructorSchema.statics.createCourse = (info) => {
	const title = info['title'];
	const topic = info['topic'];
	const description = info['description'];
	const username = info['username'];

	var course = new Course({
		title,
		topic,
		description,
		instructor: username
	});

	return course.save().then((course) => {
		return Instructor.findOneAndUpdate({username: username},
			{$push: {"courses": {course_id: course._id, course_title: title}}},
			{safe: true, upsert: true}
		);
	});
};

// InstructorSchema.statics.findCourses = function(user, callback) {
// 	console.log(user);
// 	Course.find({instructor: user.username}, function(err, courses) {
// 		if (err) throw err;
// 		callback(null, courses);
// 	});
// }
InstructorSchema.statics.findCourses = (user) => {
	return Course.find({instructor: user.username});
}

var Instructor = mongoose.model('instructor', InstructorSchema);

module.exports = Instructor;
