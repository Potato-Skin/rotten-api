const { Schema, model } = require("mongoose");

const objectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  user: {
    type: objectId,
    ref: "User",
  },
  text: {
    type: String,
    required: true,
  },
});

const Message = model("Message", messageSchema);

module.exports = Message;
