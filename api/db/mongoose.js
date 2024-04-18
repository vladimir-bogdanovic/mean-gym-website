const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/GymMeanStack")
  .then(() => {
    console.log("connected to mongoDB succsesfuly");
  })
  .catch((er) => {
    console.log(`error occured: ${er}`);
  });

module.exports = {
  mongoose,
};
