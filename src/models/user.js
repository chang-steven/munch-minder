const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const uniqueValidator = require('mongoose-unique-validator');
// const uniqueArrayPlugin = require('mongoose-unique-array');

const userSchema = mongoose.Schema({
  userName: {type: String, required: true, unique: true},
  userEmail: {type: String, lowercase: true, unique: true, require: true},
  password: {type: String, required: true},
  joinDate: {type: Date, default: Date.now, required: true},
  avatar: {type: mongoose.Schema.Types.ObjectId, ref: 'Avatar'},
  // Friends will be an array of objects listing friends
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  //Munches will be an array of objects listing munches
  munches: [{type: mongoose.Schema.Types.ObjectId, ref: 'Munch'}],
  groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
});

//Save the user's hashed password
userSchema.pre('save', function(next) {
  let user = this;
  if(this.isModified('password') || this.isNew) {
      return bcrypt.hash(user.password, 10)
    .then( (hash) => {
      user.password = hash;
      return next();
    })
    .catch( function(err) {
      console.error('Something went wrong');
      next(err);
    });
  }
  return next();
});

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

// userSchema.plugin(uniqueValidator);
// userSchema.plugin(uniqueArrayPlugin);


const User = mongoose.model('User', userSchema);

module.exports = {User};
