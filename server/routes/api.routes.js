const express = require("express");
const router = express.Router();

const cohortRouter = require("./cohorts.routes");
const studentRouter = require("./students.routes");
const userRouter = require("./user.routes");
const { isAuthenticated } = require("../middleware/jwt-middleware");

router.use("/cohorts", cohortRouter);
router.use("/students", studentRouter);
router.use("/users", isAuthenticated, userRouter)


module.exports = router;