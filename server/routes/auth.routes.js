const express = require("express");
const User = require("../models/User.models")
const router = express.Router();

router.post("/signup", async(req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        res.status(200).json(newUser);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
