const mongoose = require('mongoose');

const munchSchema = mongoose.Schema({
  // userId: {type: String, required: true},
  date: {type: Date, default: Date.now, required: true},
  type: {type: String, required: true},
  description: {type: String, required: true},
  emoji: {type: String},
  likes: {
    thumbsUp: {type: Number},
    thumbsDown: {type: Number}
  },
  notes: {type: String}
});

const Munch = mongoose.model('Munch', munchSchema);

module.exports = {Munch};
