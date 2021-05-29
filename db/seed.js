require("dotenv/config");
const mongoose = require("mongoose");

const Movie = require("../models/Movie.model");

const moviesArr = [
  {
    title: "Mulhlland Drive",
    director: "David Lynch",
    cast: ["Who", "The", "Hell", "Cares", "Naomi Watts"],
    dateOfRelease: 2002,
    coverPic:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.traileraddict.com%2Fcontent%2Funiversal-pictures%2Fmulholland-dr-poster.jpg&f=1&nofb=1",
    description: "Clearly John and Ola appreciate",
  },
  {
    title: "Ace Ventura: Pet Serial Killer",
    director: "Not Jim Carrey",
    cast: ["!Jim Carrey"],
    dateOfRelease: 1995,
    coverPic:
      "https://res.cloudinary.com/dlfxinw9v/image/upload/v1621082049/rottenPotatoes/image_bri9wj.png",
    description: "When Ace goes wild, how will the animals react?",
  },
  {
    title: "El Risas",
    director: "Nadie",
    cast: ["Joaquim Madrid"],
    dateOfRelease: 2019,
    coverPic:
      "https://res.cloudinary.com/dgmm3pkuc/image/upload/v1617818878/ironflix/IMG_5314_xg8tp6.jpg",
    description: "El Risas es loco e gusta queso",
  },
];

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/rotten-api")
  .then(() => {
    console.log("CONNECTED WITH STUFF");
    Movie.insertMany(moviesArr).then(() => {
      console.log("ADDED STUFF");
      mongoose.disconnect();
      console.log("DISCONNECTED STUFF");
    });
  });
