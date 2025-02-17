const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.config.MONGODB_URL, {
      userNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected successfully..."))
    .catch((error) => {
      console.log("Database connection failed!");
      console.error(error);
      process.exit(1);
    });
};
