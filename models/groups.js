const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  _id: {type: String},
  groupName: {type: String, required: true, unique: true},
  createDate: {type: Date, required: true},
//Array of Objects listing out the users in the group
  groupMembers: [{
    memberId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    role: {type: String, enum: ['Member', 'Organizer'], default: 'Member'}
  }]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = {Group};
