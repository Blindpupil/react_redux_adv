const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// Define model
const userSchema = new Schema({
  // since the uniqueness test isn't case blind, store all records in lower
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// On save hook, encrypt password
userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      return next();
    })
  });
});

userSchema.methods.comparePassword = function (candidate, callback) {
  bcrypt.compare(candidate, this.password, function (err, isMatch) {
    if (err) return callback(err);

    callback(null, isMatch);
  })
};

// Create model class
const ModelClass = mongoose.model('user', userSchema);

// Export it
module.exports = ModelClass;