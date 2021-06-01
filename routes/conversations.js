const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Conversation = require("../models/Conversation.model");
const Message = require("../models/Message.model");
const User = require("../models/User.model");

router.get("/", isLoggedIn, (req, res) => {
  Conversation.find({
    $or: [{ user1: req.user._id }, { user2: req.user._id }],
  }).then((allConversations) => {
    res.json(allConversations);
  });
});

router.post("/new-message", isLoggedIn, (req, res) => {
  const { text, other } = req.body;

  User.findById(other).then((user) => {
    if (!user) {
      return res.status(400).json({ errMessage: "Why you lie?" });
    }
    Message.create({
      text,
      user: req.user._id,
    }).then((messageCreated) => {
      Conversation.create({
        user1: req.user._id,
        user2: user._id,
        messages: [messageCreated._id],
        user1Read: true,
      }).then((createdConversation) => {
        console.log("createdConversation:", createdConversation);
        res.json("ALL GOOD");
      });
    });
  });
});

module.exports = router;
