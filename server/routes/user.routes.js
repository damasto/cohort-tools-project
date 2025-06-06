const express = require("express");
const router = express.Router();
const User = require("../models/User.models");

router.get("/:id", async (req, res, next) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id);
        res.status(200).json(user)
    } catch(err) {
        next(err)
    }
})

module.exports = router