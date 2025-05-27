const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const origins = ["http://localhost:5173"]

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
app.use(logger("dev"));
app.use(express.static("public"));
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

});

app.get("/api/cohorts/:cohortId", async (req, res) => {
  const {cohortId} = req.params;

  try {
    const cohort = await Cohort.findById(cohortId);
    res.status(200).json(cohort);
  } catch (err) {
    res.status(400).json({message: err.message});
  }

});

app.post("/api/cohorts", async (req, res) => {
  try {
    const newCohort = await Cohort.create(req.body);
    res.status(201).json(newCohort);
  } catch (err) {
    res.status(400).json({message: err.message});
  }

});

app.put("/api/cohorts/:cohortId", async (req, res) => {
  const {cohortId} = req.params;
  const data = req.body;

  try {
    const updateCohort = await Cohort.findByIdAndUpdate(cohortId, data);
    res.status(200).json(updateCohort)
  } catch (err) {
    res.status(400).json({message: err.message})
  }

});

app.delete("/api/cohorts/:cohortId", async (req, res) => {
  const {cohortId} = req.params;

  try {
    const deletedCohort = await Cohort.findByIdAndDelete(cohortId);
    res.status(200).json(deletedCohort);
  } catch (err) {
    res.status(400).json({message: err.message})
  }
});


app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students)
  } catch (err) {
    res.status(500).json({message: err.message})
  }

});

app.post("/api/students", async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({message: err.message});
  }

});

app.get("/api/students/cohort/:cohortId", async (req, res) => {
  const {cohortId} = req.params;

  try{
    const students = await Student.find({cohort: cohortId});
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({message: err.message});
  }

});

app.get("/api/students/:studentId", async (req, res) => {
  const {studentId} = req.params;

  try {
    const student = await Student.findById(studentId);
    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({message: err.message});
  }

});

app.put("/api/students/:studentId", async (req, res) => {
  const {studentId} = req.params;
  const data = req.body;

  try {
    const updateStudent = await Student.findByIdAndUpdate(studentId, data);
    res.status(200).json(updateStudent)
  } catch (err) {
    res.status(400).json({message: err.message})
  }

})

app.delete("/api/students/:studentId", async (req, res) => {
  const {studentId} = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    res.status(200).json(deletedStudent);
  } catch (err) {
    res.status(400).json({message: err.message})
  }
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});