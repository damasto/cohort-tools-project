const express = require("express");
const router = express.Router();

const cohortRouter = require("./cohorts.routes");
const studentRouter = require("./students.routes");

router.use("/cohorts", cohortRouter);
router.use("/students", studentRouter);


module.exports = router;