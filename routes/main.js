const express = require('express');
const { sortQuestionsByTime, sortQuestionsByAnsNum, getQuestionsByKeywords } = require('../data/questions');
const router = express.Router();
const questions = require('../data/questions')
const userData = require('../data/users');
let logOutFlag = false;

router.get('/', function(req,res)  {
    res.render("main/mainpage");
    return;
});
router.post('/search', async(req,res)=>{
    let search = req.body.data;
    let searchQuestion = await getQuestionsByKeywords(search);
    // get the name for all question , using loop to return 
    let A = {returnSearch:searchQuestion};
    res.json(A);
})

router.post('/popular',async(req,res)=>{
    if(req.body.ask==true){
        let allQuestionSort =await sortQuestionsByAnsNum(await questions.getAllQuestions(), 20)
        // get the name for all question , using loop to return 
    
        let A = {returnPopular:allQuestionSort};
        res.json(A);
    }
})

router.post('/searchNew',async(req,res)=>{

})
module.exports = router;