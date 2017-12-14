const mongoose = require('mongoose');

// define the Messge model schema
const ChatSchema = new mongoose.Schema({
  thread_id: {
    type: String,
    index: { unique: true }
  },
  message:[{
    sender_id: {
    type: String,
    index: { unique: true }
  },
  receiver_id: {
    type: String,
    index: { unique: true }
  },
  text: String
}]
});


module.exports = mongoose.model('Chat', ChatSchema);