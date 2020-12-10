const express = require('express');
const router = express.Router();
const userData = require('../data/users');

let logOutFlag = false;

router.get('/main', function(req,res)  {
    res.render("main/mainpage");
    return;
});
router.get('/search', async(req,res)=>{

})
module.exports = router;