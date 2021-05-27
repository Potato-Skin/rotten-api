const { Router } = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const Movie = require("../models/Movie.model");
const Review = require("../models/Review.model");
const Rating = require("../models/Rating.model");

const router = Router();

router.get("/", (req, res) => {
  Movie.find({}).then((allMovies) => {
    res.json(allMovies);
  });
});

router.get("/:allTheSingleMovies", (req, res) => {
  // http://localhost:5000/api/movies/laura
  // http://localhost:5000/api/movies/khryis
  // http://localhost:5000/api/movies/luis
  // {allTheSingleMovies: laura}
  // {allTheSingleMovies: khryis}
  Movie.findById(req.params.allTheSingleMovies)
    .populate("reviews")
    .populate("ratings")
    .then((movie) => {
      res.json(movie);
    });
});

router.post("/add", isLoggedIn, (req, res) => {
  // http://localhost:5000/api/movies/add
  // {}
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

router.post("/:movieId/add-rating", isLoggedIn, (req, res) => {
  const { rating } = req.body;

  if (!rating) {
    // 4xx CLIENT ERROR || 5xx SERVER ERROR
    return res.status(400).json({
      errMessage:
        "Thats no rating, i don't know. whatever.... This is not the André you're looking for",
    });
  }

  Rating.create({
    rating,
    user: req.user._id,
  })
    .then((newRating) => {
      console.log("newRating:", newRating);

      Movie.findByIdAndUpdate(
        req.params.movieId,
        { $addToSet: { ratings: newRating._id } },
        { new: true }
      )

        .populate("ratings")
        .populate("reviews")

        .then((updatedMovie) => {
          res.json({
            message: "These are indeed the André you're looking for",
            movie: updatedMovie,
          });
        });
    })

    .catch((err) => {
      console.error(err.message);
      res.status(500).json({ errorMessage: "I don't know. Do you?" });
    });
});

module.exports = router;
