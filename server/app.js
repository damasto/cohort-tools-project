const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const origins = ["'http://localhost:5173'"]

const mongoose = require("mongoose")
const cohorts = require("./cohorts.json");
const students = require("./students.json");
const Cohort = require("./models/Cohort.models");
const Student = require("./models/Student.models")


// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();
const PORT = 5005;


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
 
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to mongo", err));



app.use(cors({
  origin: origins
}))
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


app.get("/api/cohorts", async (req, res) => {

  try {
    const cohorts = await Cohort.find();
    res.json(cohorts)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students)
  } catch (err) {
    res.status(500).json({message: err.message})
  }
})


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});