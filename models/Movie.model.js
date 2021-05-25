const { Schema, model } = require("mongoose");

const movieModel = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  director: {
    type: String,
  },
  cast: [
    {
      type: String,
    },
  ],
  dateOfRelease: {
    type: Number,
  },
  coverPic: {
    type: String,
  },
  description: {
    type: String,
  },
  trailer: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
});

const Movie = model("Movie", movieModel);

module.exports = Movie;
