const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const groupSchema = mongoose.Schema({
  groupName: {type: String, required: true, unique: true},
  createDate: {type: Date, required: true},
//Array of Objects listing out the users in the group
  groupMembers: [{
    members: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    role: {type: String, enum: ['Member', 'Organizer'], default: 'Member'}
  }]
});

groupSchema.plugin(uniqueValidator);

const Group = mongoose.model('Group', groupSchema);

module.exports = {Group};
