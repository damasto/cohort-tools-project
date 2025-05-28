const express = require("express");
const Student = require("../models/Student.models");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
      const students = await Student.find().populate("cohort");
      res.json(students)
    } catch (err) {
      next(err);
    }
  
  });
  
  router.post("/", async (req, res, next) => {
    try {
      const newStudent = await Student.create(req.body);
      res.status(201).json(newStudent);
    } catch (err) {
      next(err);
    }
  
  });
  
  router.get("/cohort/:cohortId", async (req, res, next) => {
    const {cohortId} = req.params;
  
    try{
      const students = await Student.find({cohort: cohortId}).populate("cohort");
      res.status(200).json(students);
    } catch (err) {
      next(err);
    }
  
  });
  
  router.get("/:studentId", async (req, res, next) => {
    const {studentId} = req.params;
  
    try {
      const student = await Student.findById(studentId).populate("cohort");
      res.status(200).json(student);
    } catch (err) {
      next(err)
    }
  
  });
  
  router.put("/:studentId", async (req, res, next) => {
    const {studentId} = req.params;
    const data = req.body;
  
    try {
      const updateStudent = await Student.findByIdAndUpdate(studentId, data);
      res.status(200).json(updateStudent)
    } catch (err) {
      next(err);
    }
  
  })
  
  router.delete("/:studentId", async (req, res, next) => {
    const {studentId} = req.params;
  
    try {
      const deletedStudent = await Student.findByIdAndDelete(studentId);
      res.status(200).json(deletedStudent);
    } catch (err) {
      next(err)
    }
  });

  module.exports = router;