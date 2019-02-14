const mongoose = require('mongoose');
const Course = require('./course');

// Student Schema
const StudentSchema = mongoose.Schema({
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
		course_title: {type:String}
	}]
});

// StudentSchema.statics.findStudentByUsername = function(username, callback){
// 	var query = {username: username};
// 	Student.findOne(query, callback);
// }
StudentSchema.statics.findStudentByUsername = (username) => {
	return Student.findOne({username: username});
}

// Register Student for Class
// StudentSchema.statics.register = function(info, callback) {
// 	console.log('INSIDE STUDFENT REGISTER, InFO array', info);
//   student_username = info['student_username'];
//   course_id = info['course_id'];
//   course_title = info['course_title'];
//
// 	Course.findOneAndUpdate({_id: course_id},
// 		{$push: {"students": {student_username: student_username}}},
// 		{safe: true, upsert: true},
// 		function(err) {
// 			if (err) throw err;
// 			var query = {username: student_username};
// 	    Student.findOneAndUpdate(
// 	      query,
// 	      {$push: {"courses": {course_id: course_id, course_title: course_title}}},
// 	      {safe: true, upsert: true},
// 	      callback
// 	    );
// 		}
// 	);
// }
StudentSchema.statics.register = (info) => {
  student_username = info['student_username'];
  course_id = info['course_id'];
  course_title = info['course_title'];

	return Course.findOneAndUpdate({_id: course_id},
		{$push: {'students': {student_username: student_username}}},
		{safe: true, upsert: true}
	).then(() => {
		return Student.findOneAndUpdate({username: student_username},
			{$push: {"courses": {course_id: course_id, course_title: course_title}}},
			{safe: true, upsert: true}
		);
	});
}

// StudentSchema.statics.findCourses = function(user, callback) {
// 	console.log(user);
// 	Student.findOne({username: user.username}, function(err, student) {
// 		if (err) throw err;
// 		var coursesArr = student.courses;
// 		console.log('inside studentSchema findCourses!!!!!!!');
// 		callback(null, coursesArr);
// 	});
// }
StudentSchema.statics.findCourses = (user) => {
	return Student.findOne({username: user.username}).then((student) => {
		return student.courses;
	});
}

// Se findCourses viene usato da qualche altra parte, ho bisogno di questo metodo in students router.get dashboard
// StudentSchema.statics.findStudentCourses = function(user, callback) {
// 	Course.find({"students.student_username": user.username}, function(err, courses) {
// 		if (err) throw err;
// 		callback(null, courses);
// 	});
// }
StudentSchema.statics.findStudentCourses = (user) => {
	return Course.find({"students.student_username": user.username});
}


var Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
