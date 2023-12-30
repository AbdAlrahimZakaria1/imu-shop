const mongoose = require("mongoose");

// mongoose.connect("127.0.0.1:3000", () => {
//   console.log("Hello from db!");
// });

const app = require("./app");

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
