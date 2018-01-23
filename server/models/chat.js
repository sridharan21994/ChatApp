const mongoose = require('mongoose');

// define the Messge model schema
const ChatSchema = new mongoose.Schema({
  message:Array,
  initiator: Object,
  block: Array,
  blocked_by: Array,
  unread: Boolean
});


module.exports = mongoose.model('Chat', ChatSchema);