const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  username : String,
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  description : String,
  imageURL : String,
  date : String
});

module.exports = mongoose.model('Post', postSchema);
