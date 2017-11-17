const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const groupSchema = mongoose.Schema({
  groupName: {type: String, required: true, unique: true},
  createDate: {type: Date, default: Date.now, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
//Array of Objects listing out the users in the group
  groupMembers: [{_id: false,
    member: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    role: {type: String, enum: ['Member', 'Organizer'], default: 'Member'}
  }]
});

groupSchema.plugin(uniqueValidator);

const Group = mongoose.model('Group', groupSchema);

module.exports = {Group};
