var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  type: { type: String }
});



// Get User By Id
// userSchema.methods.findUserById = function(id, callback){
// 	User.findById(id, callback);
// }
userSchema.methods.findUserById = (id) => {
	return User.findById(id);
}

// Get User by Username
// userSchema.methods.findUserByUsername = function(username, callback){
// 	var query = {username: username};
// 	User.findOne(query, callback);
// }
userSchema.methods.findUserByUsername = (username) => {
	return User.findOne({username: username});
}

// here i might use bcryptjs, check for errors and return a promise
// userSchema.methods.checkPassword = function(plainPassword, callback) {
//   bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
//     if (err) throw err;
//     callback(err, isMatch);
//   });
// };
userSchema.methods.checkPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};


// Create Student User
// userSchema.statics.saveStudent = function(newUser, newStudent, callback) {
// 	//async.parallel([newUser.save, newStudent.save], callback); // instead i do as BELOW
// 	newUser.save(function(err, user) {
// 		if (err) callback(err);
// 		console.log('NOW IN: newUser saved:', user);
// 		newStudent.save(function(err, student) {
// 			if (err) callback(err);
// 			console.log('NOW IN 2: newStudent saved:', student);
// 			callback(null, user);
// 		});
// 		//END
// 	});
// }
userSchema.statics.saveStudent = (newUser, newStudent) => {
	return newUser.save().then(() => {
    newStudent.save();
  });
};

// userSchema.statics.saveInstructor = function(newUser, newInstructor, callback){
// 	//async.parallel([newUser.save, newInstructor.save], callback);
// 	newUser.save(function(err, user) {
// 		if (err) callback(err);
// 		console.log('NOW IN: newUser saved:', user);
// 		newInstructor.save(function(err, instructor) {
// 			if (err) callback(err);
// 			console.log('NOW IN 2: newInstructor saved:', instructor);
// 			callback(null, user);
// 		});
// 	});
// }
userSchema.statics.saveInstructor = (newUser, newInstructor) => {
	return newUser.save().then(() => {
    newInstructor.save();
  });
}

userSchema.statics.updateStudent = (user, doc) => {
  // if (user.email) {
  //   user.update({
  //     $set: {
  //       email: user.email
  //     }
  //   });
  // }
  // Student.findOneAndUpdate({username: user.username}, {$set: doc}, callback);
}

userSchema.statics.updateInstructor = (user, doc) => {

}





// Defines a function that runs before model is saved
userSchema.pre("save", function(next) {
  // Saves a reference to the user
  var user = this;
  // Skips this logic if password isn’t modified
  if (!user.isModified('password')) {
    return next();
  }
  // Generates a salt for the hash, and calls the inner function once completed
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return next(err); }
    // Hashes the user’s password
    bcrypt.hash(user.password, salt, function(err, hashedPassword) {
      if (err) { return next(err); }
      // Stores the password and continues with the saving
      user.password = hashedPassword;
      next();
    });
  });
});

var User = mongoose.model("User", userSchema);

module.exports = User;
