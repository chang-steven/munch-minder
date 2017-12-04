const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  groupName: {type: String, required: true, unique: true},
  createDate: {type: Date, default: Date.now, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    //Array of Objects listing out the users in the group
  groupMembers: [{_id: false, member: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    role: {type: String, enum: ['Member', 'Organizer'], default: 'Member'}
  }]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = {Group};
