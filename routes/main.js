const express = require('express');
const router = express.Router();
const userData = require('../data/users');
let logOutFlag = false;

router.get('/main', async(req,res) => {
    res.render("mainpage");
    return;
});
module.exports = router;