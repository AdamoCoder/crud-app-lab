const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    color: String,
    isFourDoor: Boolean,
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;