const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    required: true,
    type: Number,
  },
});

const Rating = model("Rating", ratingSchema);

module.exports = Rating;
