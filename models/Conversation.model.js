const { Schema, model } = require("mongoose");

const objectId = Schema.Types.ObjectId;

const conversationSchema = new Schema({
  messages: [
    {
      type: objectId,
      ref: "Message",
    },
  ],
  user1: {
    type: objectId,
    ref: "User",
  },
  user2: {
    type: objectId,
    ref: "User",
  },
  user1Read: {
    type: Boolean,
    default: false,
  },
  user2Read: {
    type: Boolean,
    default: false,
  },
});

const Conversation = model("Conversation", conversationSchema);

module.exports = Conversation;
