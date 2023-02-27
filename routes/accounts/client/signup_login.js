const express = require('express');
const { model } = require('mongoose');
const router = express.Router();

router.get('/',(req,res,next) => {
    res.status(200).json({
        msg: "test route"
    })
})

module.exports = router