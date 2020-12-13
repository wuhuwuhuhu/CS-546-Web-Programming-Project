const express = require('express');
const { sortQuestionsByTime, sortQuestionsByAnsNum, getQuestionsByKeywords, getQuestionsByKeywordsAndTopic } = require('../data/questions');
const router = express.Router();
const questions = require('../data/questions')
const userData = require('../data/users');
let logOutFlag = false;

router.get('/', function(req,res)  {
    res.render("main/mainpage");
    return;
});
router.post('/search', async(req,res)=>{
    let keywords = req.body.keywords;
    let sort = req.body.sort;
    let topic =req.body.topic;
    let limit =parseInt(req.body.limit);
    console.log(sort=="Date from new to old");
    if(topic=="allTopic"){
        if(topic=="allTopic"){
            let A = await sortQuestionsByTime(await getQuestionsByKeywords(keywords),limit);
            res.json({A});
        }
        else{
            let A = await sortQuestionsByTime(await getQuestionsByKeywordsAndTopic(keywords,topic),limit);
            res.json({A});
        }
    }

    else{
        if(topic=="allTopic"){
            let A = await sortQuestionsByAnsNum(await getQuestionsByKeywords(keywords),limit);
            res.json({A});
        }
        else{
            let A = await sortQuestionsByAnsNum(await getQuestionsByKeywordsAndTopic(keywords,topic),limit);
            res.json({A});
        }
    }
    
    // get the name for all question , using loop to return 
})

router.post('/popular',async(req,res)=>{
    if(req.body.ask==true){
        let allQuestionSort =await sortQuestionsByAnsNum(await questions.getAllQuestions(), 20)
        // get the name for all question , using loop to return 
    
        let A = {returnPopular:allQuestionSort};
        res.json(A);
    }
})

module.exports = router;