const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    required: true,
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
});

const Review = model("Review", reviewSchema);

module.exports = Review;
