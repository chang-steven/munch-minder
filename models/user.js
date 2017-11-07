const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: {type: String, required: true, unique: true},
  userEmail: {type: String, lowercase: true, unique: true, require: true},
  password: {type: String, required: true},
  joinDate: {type: Date, required: true},
  // peeps: {
  //   //Friends will be an array of objects listing friends
  //   friends: [{
  //     userId: {type: String, required: true},
  //     userName: {type: String, required: true, unique: true},
  //     userEmail: {type: String, lowercase: true, unique: true, require: true},
  //   }],
    //Groups will be an array of objects that the user will belong to listing the other users in the group
    // groups: [{
    //   groupName: {type: String, required: true},
    //   groupId: {type: String, required: true},
    //   //Array of Objects listing out the users in the group
    //   groupMembers: [{
    //     userId: {type: String, required: true},
    //     userName: {type: String, required: true},
    //     role: {type: String, enum: ['Member', 'Organizer'], default: 'Member'}
    //   }]
    // }],
  // }
});


const User = mongoose.model('User', userSchema);

module.exports = {User};
