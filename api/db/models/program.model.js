const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  _userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Program = mongoose.model("Program", programSchema);
module.exports = { Program };
