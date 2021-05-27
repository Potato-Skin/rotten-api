const { Router } = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const Movie = require("../models/Movie.model");
const Review = require("../models/Review.model");

const router = Router();

router.get("/", (req, res) => {
  Movie.find({}).then((allMovies) => {
    res.json(allMovies);
  });
});

router.get("/:allTheSingleMovies", (req, res) => {
  Movie.findById(req.params.allTheSingleMovies)
    .populate("reviews")
    .then((movie) => {
      res.json(movie);
    });
});

router.post("/add", isLoggedIn, (req, res) => {
  Movie.findOne({
    title: req.body.title,
  })
    .then((singleMovie) => {
      if (singleMovie) {
        return res
          .status(400)
          .json({ errorMessage: "Movie already in db", key: "title" });
      }

      const { title, director, cast, dateOfRelease, description, trailer } =
        req.body;

      Movie.create({
        title,
        director,
        cast: cast.split(",").map((e) => e.trim()),
        dateOfRelease,
        description,
        trailer,
      })
        .then((createdMovie) => {
          res.json({ movie: createdMovie });
        })
        .catch((err) => {
          console.log(err);
          res.json(500).json({ errorMessage: err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json(500).json({ errorMessage: err.message });
    });
});

router.post("/:id/add-review", isLoggedIn, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ errMessage: "Not good enough" });
  }

  Review.create({
    title,
    body,
    user: req.user._id,
  }).then((newReview) => {
    Movie.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { reviews: newReview._id },
      },
      { new: true }
    )
      .populate("reviews")
      .then((updatedMovie) => {
        res.json({ message: "Cool beans, brah", movie: updatedMovie });
      });
  });
});

module.exports = router;
