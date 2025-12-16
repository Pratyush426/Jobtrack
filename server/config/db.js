const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/jobtrack");
console.log("Connected to DB:", mongoose.connection.name);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
