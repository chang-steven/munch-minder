const mongoose = require('mongoose');

const munchSchema = mongoose.Schema({
  postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  date: {type: Date, default: Date.now, required: true},
  description: {type: String, required: true},
  where: {type: String},
  emoji: {type: String},
  likes: {
    thumbsUp: {type: Number},
    thumbsDown: {type: Number}
  },
  notes: {type: String},
  image: {type: String}
});


//api.representation perhaps of: who, what, when, where, how was it?


const Munch = mongoose.model('Munch', munchSchema);

module.exports = {Munch};
