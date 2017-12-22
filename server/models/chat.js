const mongoose = require('mongoose');

// define the Messge model schema
const ChatSchema = new mongoose.Schema({
  message:Array,
  initiator: Object

});


module.exports = mongoose.model('Chat', ChatSchema);