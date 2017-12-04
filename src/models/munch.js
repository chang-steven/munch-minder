const mongoose = require('mongoose');

const munchSchema = mongoose.Schema({
  postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  userName: {type: String, required: true},
  date: {type: Date, default: Date.now, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  userThumbsUp: {type: String},
  image: {type: String}
});

const Munch = mongoose.model('Munch', munchSchema);

module.exports = {Munch};
