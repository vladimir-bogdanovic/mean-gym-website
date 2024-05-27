const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: false,
  },
  _muscleId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = { Exercise };
