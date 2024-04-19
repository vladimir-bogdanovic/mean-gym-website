const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  _muscleId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Exercise = mongoose.model("Program", exerciseSchema);
module.exports = { Exercise };
