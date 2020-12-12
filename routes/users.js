/*
router for information page
in delievry version, this file should not have code directly operate database
author: Wu Haodong
date: 2020-11-13 16:01:40
*/
const express = require('express');
const xss = require('xss');
const router = express.Router();
const usersData = require('../data/users');
const questionsData = require('../data/questions');
const reviewsData = require("../data/reviews");
const answerData = require("../data/answers");

router.get('/', async(req,res) => {
    const userid = "5faf0ec9dd212c3f1a74cef1";
    //const userid = req.session.user._id
    let user = await usersData.getUserById(userid);
    let userName = user["userName"];
    let userEmail = user["email"];
    let userRegistDate = user["dateSignedIn"];
    let userQuestions = user["questions"];
    let userAnswers = user["answers"];
    let userReviews = user["reviews"]
    let userVotedForReviews = user["votedForReview"];
    let userVotedForAnswers = user["votedForAnswers"];

    let userQuestionsList = [];
    for(let i = 0; i < userQuestions.length; i++)
    {
        let question = await questionsData.getQuestionById(userQuestions[i]);
        let questionName = question["content"];
        let questionUrl = `questions/${question["_id"]}`;
        userQuestionsList.push({
            questionName: questionName,
            questionUrl: questionUrl
        });
    }

    let userAnswersList = [];
    for(let i = 0; i < userAnswers.length; i++)
    {
        let answer = await answerData.getAnwserById(userAnswers[i]);
        let question = await questionsData.getQuestionById(answer["questionId"]);
        let questionName = question["content"];
        let questionUrl = `questions/${question["_id"]}`;
        let answerContent = answer["content"];
        userAnswersList.push({
            questionName: questionName,
            questionUrl: questionUrl,
            answerContent: answerContent
        });
    }

    let userReviewsList = [];
    for(let i = 0; i < userReviews.length; i++)
    {   let review = await reviewsData.getReviewById(userReviews[i]);
        let answer = await answerData.getAnwserById(review["answerId"]);
        let question = await questionsData.getQuestionById(answer["questionId"]);
        let questionName = question["content"];
        let questionUrl = `questions/${question["_id"]}`;
        let answerContent = answer["content"];
        let reviewContent = review["content"];
        userReviewsList.push({
            questionName: questionName,
            questionUrl: questionUrl,
            answerContent: answerContent,
            reviewContent: reviewContent
        });
    }

    let userVotedAnswersList = [];
    for(let i = 0; i < userVotedForAnswers.length; i++)
    {
        let answer = await answerData.getAnwserById(userVotedForAnswers[i]);
        let question = await questionsData.getQuestionById(answer["questionId"]);
        let questionName = question["content"];
        let questionUrl = `questions/${question["_id"]}`;
        let answerContent = answer["content"];
        userVotedAnswersList.push({
            questionName: questionName,
            questionUrl: questionUrl,
            answerContent: answerContent
        });
    }

    let userVotedReviewsList = [];
    for(let i = 0; i < userVotedForReviews.length; i++)
    {   let review = await reviewsData.getReviewById(userVotedForReviews[i]);
        let answer = await answerData.getAnwserById(review["answerId"]);
        let question = await questionsData.getQuestionById(answer["questionId"]);
        let questionName = question["content"];
        let questionUrl = `questions/${question["_id"]}`;
        let answerContent = answer["content"];
        let reviewContent = review["content"];
        userVotedReviewsList.push({
            questionName: questionName,
            questionUrl: questionUrl,
            answerContent: answerContent,
            reviewContent: reviewContent
        });
    }

    
    res.render("user",{
        title: "Personal Information",
        userName: userName,
        userEmail: userEmail,
        userRegistDate: new Date(userRegistDate).toDateString(),
        userQuestionsList: userQuestionsList,
        userAnswersList: userAnswersList,
        userReviewsList: userReviewsList,
        userVotedAnswersList: userVotedAnswersList,
        userVotedReviewsList: userVotedReviewsList
    })
    return;
});
router.post('/changePassword', async(req,res) => {
    let newPassword = xss(req.body.newPassword);
    let oldPassword = xss(req.body.oldPassword);
    const user = 
    res.json ({
        status: false,
        message: "没连user数据呢"
    });
});

router.post('/getQuestions', async(req,res) => {
    let limit = parseInt(xss(req.body.limit));
    let sort = xss(req.body.sort);

    const userid = "5fd2b0e9f293b535faad70ea";
    //const userid = req.session.user._id
    const user = await usersData.getUserById(userid);
    let userQuestions = user["questions"];
    let userQuestionsObjectsList = [];
    let userQuestionsList = [];
    for(let i = 0; i < userQuestions.length; i++)
    {
        let question = await questionsData.getQuestionById(userQuestions[i]);
        userQuestionsObjectsList.push(question);
    }
    if(sort === "Answers number from high to low"){
        userQuestionsObjectsList = await questionsData.sortQuestionsByAnsNum(userQuestionsObjectsList, limit);
    }
    else{
        userQuestionsObjectsList = await questionsData.sortQuestionsByTime(userQuestionsObjectsList, limit);
    }
    
    for(let i = 0; i < userQuestionsObjectsList.length; i++)
    {
        let question = userQuestionsObjectsList[i];
        let questionName = question["content"];
        let questionUrl = `questions/${question["_id"]}`;
        let createdAt = new Date(question["questionCreatedTime"]).toDateString();

        userQuestionsList.push({
            questionId: question._id.toString(),
            questionName: questionName,
            questionUrl: questionUrl,
            numberOfAnswers: question["answers"].length,
            createdAt: createdAt

        });
    }
    res.json({
        userQuestionsList:userQuestionsList
    });

});
router.post('/deleteQuestion', async(req,res) => {
    let id = xss(req.body.questionId);
    console.log(`delete ${id}`);
    res.json({
        status: true
    });
});
module.exports = router;