const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/me", (req, res) => {
  // console.log(req.headers);
  // console.log(req.headers);
  // res.json(true);
  const accessToken = req.headers.authorization;

  Session.findById(accessToken)
    .populate("user")
    .then((theSession) => {
      console.log("theSession:", theSession);
      res.json(theSession.user);
    });
});

router.post("/signup", (req, res) => {
  // First validate the req.body
  const { username, email, password } = req.body;
  console.log("req.body:", req.body);

  if (!username || !email || !password) {
    // WE SHOULD DISPLAY AN ERROR
    // return res.json({ errorMessage: "SUcks to be you" });
    return res.status(400).json({ errorMessage: "Sucks to be you" });
  }

  if (username.length < 4) {
    // WE SHOULD DISPLAY AN ERROR
    return res
      .status(400)
      .json({ errorMessage: "Username too short", key: "username" });
  }

  if (email.length < 8) {
    // we should display an error
    return res
      .status(400)
      .json({ errorMessage: "Email too short", key: "email" });
  }

  if (password.length < 8) {
    // we should display an error
    return res
      .status(400)
      .json({ errorMessage: "Password too weak", key: "password" });
  }

  // Checking if has minimum amount of characters
  // Checking if its a strong password (perhaps)
  // IF IT REACHES HERE: WE VALIDATED THE REQ.BODY

  User.findOne({ $or: [{ username }, { email }] })
    .then((singleUser) => {
      // Check if user already exists with either username or email
      if (singleUser) {
        // WE SHOULD DISPLAY AN ERROR
        return res
          .status(400)
          .json({ errorMessage: "Sucks... But it can't be you" });
      }

      const salt = bcrypt.genSaltSync();

      const newPassword = bcrypt.hashSync(password, salt);

      User.create({
        username,
        email,
        password: newPassword,
      }).then((createdUser) => {
        Session.create({ user: createdUser._id })
          .then((createdSession) => {
            res.json({
              user: createdUser,
              accessToken: createdSession._id,
            });
          })
          .catch((err) => {
            res.status(500).json({ errorMessage: err.message });
          });
      });
    })
    .catch((err) => {
      console.log("err:", err);
      // DISPLAY ANOTHER KIND OF ERROR
      res.status(500).json({ errorMessage: err.message });
    });
  // Hash a password
  // IF SO: ERROR
  // Create a user with that data + hashed password
  // LogIn the user immediately
  // IF ALLES GUT: send the user back to the frontend
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((theUser) => {
      if (!theUser) {
        // handle the bliiiiip out of this situation
      }

      const isSamePassword = bcrypt.compare(password, theUser.password);

      if (!isSamePassword) {
        // handle the bliiiiip out of this situation
      }

      Session.create({
        user: theUser._id,
      })
        .then((createdSession) => {
          res.json({ user: theUser, accessToken: createdSession._id });
        })
        .catch((err) => {
          res.status(500).json({ errorMessage: "oops" });
        });
    })
    .catch((err) => {
      res.status(500).json({ errorMessage: "oops" });
    });
});

router.delete("/logout", (req, res) => {
  const accessToken = req.headers.authorization;

  Session.findByIdAndDelete(accessToken)
    .catch((err) => {
      console.error(err.message);
    })
    .finally(() => {
      res.json(true);
    });
});

module.exports = router;
