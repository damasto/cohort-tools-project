const express = require("express");
const Cohort = require("../models/Cohort.models");

const router = express.Router();

router.get("/", async (req, res, next) => {

    try {
        const cohorts = await Cohort.find();
        res.json(cohorts)
    } catch (err) {
        next(err);
    }

});

router.get("/:cohortId", async (req, res, next) => {
    const { cohortId } = req.params;

    try {
        const cohort = await Cohort.findById(cohortId);
        res.status(200).json(cohort);
    } catch (err) {
        next(err);
    }

});

router.post("/", async (req, res, next) => {
    try {
        const newCohort = await Cohort.create(req.body);
        res.status(201).json(newCohort);
    } catch (err) {
        next(err);
    }

});

router.put("/:cohortId", async (req, res, next) => {
    const { cohortId } = req.params;
    const update = req.body;

    try {
        const updateCohort = await Cohort.findByIdAndUpdate(cohortId, update, {new: true});
        res.status(200).json(updateCohort)
    } catch (err) {
        next(err);
    }

});

router.delete("/:cohortId", async (req, res, next) => {
    const { cohortId } = req.params;

    try {
        await Cohort.findByIdAndDelete(cohortId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;