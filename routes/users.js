const express = require('express');
const router = express.Router();
const userData = require('../data/users');

router.get('/', async(req,res) => {
    res.json({page:"user"});
    return;
});
module.exports = router;