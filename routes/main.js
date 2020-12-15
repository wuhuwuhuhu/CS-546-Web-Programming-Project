const express = require('express');
const { sortQuestionsByTime, sortQuestionsByAnsNum, getQuestionsByKeywords, getQuestionsByKeywordsAndTopic } = require('../data/questions');
const router = express.Router();
const questions = require('../data/questions');
const { getAllUserVoteList } = require('../data/vote');
const voteData = require('../data/vote')

router.get('/', function(req,res)  {
    console.log("12312")
    if(req.session.user){
        res.render("main/mainpage");
    }else{
        res.redirect("/login")
    }
   
    
    return;
});
router.post('/search', async(req,res)=>{
    let keywords = req.body.keywords;
    let sort = req.body.sort;
    let topic =req.body.topic;
    let limit =parseInt(req.body.limit);
    let A = [];
    if(sort=="Date from new to old"){
        if(topic=="allTopic"){
            let searchQuestion=await getQuestionsByKeywords(keywords);
            if(searchQuestion.length==0){
                A=[];
            }
            else{
                A= await sortQuestionsByTime(searchQuestion,limit);
            }
            
            res.json({A});
        }
        else{
            let getQuestion =await getQuestionsByKeywordsAndTopic(keywords,topic);
            if(getQuestion.length==0){
                A=[];
            }
            else{
                A = await sortQuestionsByTime(await getQuestionsByKeywordsAndTopic(keywords,topic),limit);
            }
            res.json({A});
        }
    }
    
    else
    {  
        if(topic=="allTopic"){
            if(await getQuestionsByKeywords(keywords).length==0){
                A=[]
            }
            else{
                A = await sortQuestionsByAnsNum(await getQuestionsByKeywords(keywords),limit);
            }
            res.json({A});
        }
        else{
            let searchQuestion =await getQuestionsByKeywordsAndTopic(keywords,topic);
            if(searchQuestion.length==0){
                A =[];
            }
            else{
                A = await sortQuestionsByAnsNum(await getQuestionsByKeywordsAndTopic(keywords,topic),limit);
            }
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

router.post('/honorList',async(req,res)=>{
    if(req.body.honor==true){
        let honorList = await getAllUserVoteList();
        let repsons = {honorList:honorList}
        res.json(repsons)
    }
})

module.exports = router;