const express = require("express");
const app = express();
app.use(express.json());

//LISTENING
app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
