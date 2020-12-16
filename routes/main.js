const { response } = require('express');
const express = require('express');
const { sortQuestionsByTime, sortQuestionsByAnsNum, getQuestionsByKeywords, getQuestionsByKeywordsAndTopic } = require('../data/questions');
const router = express.Router();
const questions = require('../data/questions');
const { getAllUserVoteList } = require('../data/vote');
const voteData = require('../data/vote')
const xss= require('xss')
router.get('/', async(req,res)=>  {
    res.render("main/mainpage");   
});

router.post('/search', async(req,res)=>{
    let error_msgs = "";
    if(!req.body.keywords){
        error_msgs="Must provide valid keywords to search.";
        let response = {error_msgs}
        res.status(400).json(response)
    }
    else if(!req.body.sort){
        error_msgs="Must provide sort to search.";
        let response = {error_msgs}
        res.status(400).json(response)
    }
    else if(!req.body.topic){
        error_msgs="Must provide topic to search.";
        let response = {error_msgs}
        res.status(400).json(response)
    }
    else if(!req.body.limit){
        error_msgs="Must provide limit number to search."
                let response = {error_msgs}
        res.status(400).json(response)
    }
    else{
        let keywords = xss(req.body.keywords);
        let sort = xss(req.body.sort);
        let topic =xss(req.body.topic);
        let limit =parseInt(xss(req.body.limit));
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
    }
    
    // get the name for all question , using loop to return 
})

router.post('/popular',async(req,res)=>{
    if(req.body.ask==true){
        let allQuestionSort =await sortQuestionsByAnsNum(await questions.getAllQuestions(), 10)
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