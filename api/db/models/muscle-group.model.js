const mongoose = require("mongoose");

const muscleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  _programId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const MuscleGroup = mongoose.model("MuscleGroup", muscleSchema);
module.exports = { MuscleGroup };
