const express = require('express');
const app = express();
const path = require('path');
require("dotenv").config();


const connectDB = require("./config/db");
connectDB();

//Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", require("./routes/emailRoutes"));


//Routes
const emailRoutes = require("./routes/emailRoutes");
app.use("/", emailRoutes);


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
