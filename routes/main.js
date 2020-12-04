const express = require('express');
const router = express.Router();
const userData = require('../data/users');
let logOutFlag = false;

router.get('/main', async(req,res) => {
    res.render("mainPage");
    return;
});
module.exports = router;