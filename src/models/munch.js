const mongoose = require('mongoose');
const dateFormat = require('dateformat');


const munchSchema = mongoose.Schema({
  postedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  userName: {type: String, required: true},
  date: {type: Date, default: Date.now, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  userThumbsUp: {type: String},
  likes: {type: Number},
  image: {type: String}
});

//
//
// munchSchema.virtual('formattedDate').get(function() {
//   // return 'this is my date string';
//   return dateFormat(this.date);
// });
//
//
// munchSchema.methods.apiRepr = function() {
//   return {
//     postedBy: this.postedBy,
//     userName: this.userName,
//     date: this.formattedDate,
//     title: this.title,
//     description: this.description,
//     userThumbsUp: this.userThumbsUp,
//     likes: this.likes,
//     image: this.image
//   }
// }
//

const Munch = mongoose.model('Munch', munchSchema);

module.exports = {Munch};
