const dotenv = require("dotenv");
dotenv.config(); 
const express = require('express');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Car = require("./models/car.js");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// GET /
app.get("/", async (req, res) => {
    res.render("home.ejs");
});

// GET /cars/new
app.get("/cars/new", (req, res) => {
    res.render("cars/new.ejs");
});

// GET /cars
app.get("/cars", async (req, res) => {
  const allCars = await Car.find();
  res.render("cars/index.ejs", { cars: allCars });
});

app.get("/cars/:carId", async (req, res) => {
  const foundCar = await Car.findById(req.params.carId);
  res.render("cars/show.ejs", { car: foundCar });
});

// GET localhost:3456/fruits/:fruitId/edit
app.get("/cars/:carId/edit", async (req, res) => {
  const foundCar = await Car.findById(req.params.carId);
  res.render("cars/edit.ejs", {
    car: foundCar,
  });
});

// POST /cars
app.post("/cars", async (req, res) => {
  if (req.body.isFourDoor === "on") {
    req.body.isFourDoor = true;
  } else {
    req.body.isFourDoor = false;
  }
  await Car.create(req.body);
  res.redirect("/cars/new");
});

app.delete("/cars/:carId", async (req, res) => {
  await Car.findByIdAndDelete(req.params.carId);
  res.redirect("/cars");
});

app.put("/cars/:carId", async (req, res) => {
  // Handle the 'isReadyToEat' checkbox data
  if (req.body.isFourDoor === "on") {
    req.body.isFourDoor = true;
  } else {
    req.body.isFourDoor = false;
  }
  await Car.findByIdAndUpdate(req.params.carId, req.body);
  res.redirect(`/cars/${req.params.carId}`);
});

app.listen(3456, () => {
  console.log('Listening on port 3456');
});