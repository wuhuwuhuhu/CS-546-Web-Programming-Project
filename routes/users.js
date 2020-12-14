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
const answersData = require("../data/answers");

router.get('/', async(req,res) => {
    const userid = "5fd2b0e9f293b535faad70ea";
    //const userid = req.session.user._id

    let user = await usersData.getUserById(userid);
    let userName = user["userName"];
    let userEmail = user["email"];
    let userRegistDate = user["dateSignedIn"];
    let userQuestions = user["questions"];
    let userAnswers = user["answers"];
    let userReviews = user["reviews"]
    let userVotedForReviews = user["votedForReviews"];
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
        let answer = await answersData.getAnswerById(userAnswers[i]);
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
        let answer = await answersData.getAnswerById(review["answerId"]);
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
        let answer = await answersData.getAnswerById(userVotedForAnswers[i]);
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
        let answer = await answersData.getAnswerById(review["answerId"]);
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
        let questionUrl = `question/${question["_id"]}`;
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

router.post('/getAnswers', async(req,res) => {
    let limit = parseInt(xss(req.body.limit));
    let sort = xss(req.body.sort);

    const userid = "5fd2b0e9f293b535faad70ea";
    //const userid = req.session.user._id
    const user = await usersData.getUserById(userid);
    let userAnswers = user["answers"];
    let userAnswersObjectsList = [];
    let userAnswersList = [];
    for(let i = 0; i < userAnswers.length; i++)
    {
        let answer = await answersData.getAnswerById(userAnswers[i]);
        userAnswersObjectsList.push(answer);
    }
    if(sort === "Voted score from high to low"){
        userAnswersObjectsList = await answersData.sortAnswersByVote
(userAnswersObjectsList, limit);
    }
    else{
        userAnswersObjectsList = await answersData.sortAnswersByTime(userAnswersObjectsList, limit);
    }
    
    for(let i = 0; i < userAnswersObjectsList.length; i++)
    {
        let answer = userAnswersObjectsList[i];
        let answerQuestion = await questionsData.getQuestionById(answer["questionId"])
        let answerQuestionName = answerQuestion["content"];
        let answerQuestionUrl = `question/${answerQuestion["_id"]}`;
        let recentUpdatedTime
        = new Date(answer["recentUpdatedTime"]).toDateString();
        let answerReviews = [];
        for(let j = 0; j < answer["reviews"].length; j++){
            let review = await reviewsData.getReviewById(answer["reviews"][j]);
            answerReviews.push(review["content"]);
        }
        userAnswersList.push({
            answerId: answer._id.toString(),
            questionName: answerQuestionName,
            questionUrl: answerQuestionUrl,
            answerContent: answer["content"],
            numberOfVoteUp: answer["voteUp"].length,
            numberOfVoteDown: answer["voteDown"].length,
            reviews: answerReviews,
            recentUpdatedTime: recentUpdatedTime

        });
    }
    res.json({
        userAnswersList:userAnswersList
    });

});
router.post('/deleteAnswer', async(req,res) => {
    let id = xss(req.body.answerId);
    console.log(`delete ${id}`);
    res.json({
        status: true
    });
});

router.post('/getReviews', async(req,res) => {
    let limit = parseInt(xss(req.body.limit));
    let sort = xss(req.body.sort);

    const userid = "5fd2b0e9f293b535faad70ea";
    //const userid = req.session.user._id
    const user = await usersData.getUserById(userid);
    let userReviews = user["reviews"];
    let userReviewsObjectsList = [];
    let userReviewsList = [];
    for(let i = 0; i < userReviews.length; i++)
    {
        let review = await reviewsData.getReviewById(userReviews[i]);
        userReviewsObjectsList.push(review);
    }
    if(sort === "Voted score from high to low"){
        userReviewsObjectsList = await reviewsData.sortReviewsByVote
(userReviewsObjectsList, limit);
    }
    else{
        userReviewsObjectsList = await reviewsData.sortReviewsByTime(userReviewsObjectsList, limit);
    }
    
    for(let i = 0; i < userReviewsObjectsList.length; i++)
    {
        let review = userReviewsObjectsList[i];
        let reviewAnswer = await answersData.getAnswerById(review["answerId"]);
        let reviewQuestion = await questionsData.getQuestionById(reviewAnswer["questionId"]);
        let reviewQuestionName = reviewQuestion["content"];
        let reviewQuestionUrl = `question/${reviewQuestion["_id"]}`;
        let recentUpdatedTime
        = new Date(review["recentUpdatedTime"]).toDateString();

        userReviewsList.push({
            reviewId: review._id.toString(),
            questionName: reviewQuestionName,
            questionUrl: reviewQuestionUrl,
            answerContent: reviewAnswer["content"],
            reviewContent: review["content"],
            numberOfVoteUp: review["voteUp"].length,
            numberOfVoteDown: review["voteDown"].length,
            recentUpdatedTime: recentUpdatedTime

        });
    }
    res.json({
        userReviewsList:userReviewsList
    });

});
router.post('/deleteReview', async(req,res) => {
    let id = xss(req.body.reviewId);
    console.log(`delete ${id}`);
    res.json({
        status: true
    });
});

// voted Answers
router.post('/getVotedAnswers', async(req,res) => {
    let limit = parseInt(xss(req.body.limit));
    let sort = xss(req.body.sort);
    const userid = "5fd2b0e9f293b535faad70ea";
    //const userid = req.session.user._id
    const user = await usersData.getUserById(userid);
    let userVotedAnswers = user["votedForAnswers"];
    let userVotedAnswersObjectsList = [];
    let userVotedAnswersList = [];
    for(let i = 0; i < userVotedAnswers.length; i++)
    {
        let votedAnswer = await answersData.getAnswerById(userVotedAnswers[i]);
        userVotedAnswersObjectsList.push(votedAnswer);
    }
    //Voted score of the answer from high to low
    if(sort.split(" ")[0] === "Voted"){
        userVotedAnswersObjectsList = await answersData.sortAnswersByVote
(userVotedAnswersObjectsList, limit);
    }
    else{
        userVotedAnswersObjectsList = await answersData.sortAnswersByTime(userVotedAnswersObjectsList, limit);
    }
    
    for(let i = 0; i < userVotedAnswersObjectsList.length; i++)
    {
        let votedAnswer = userVotedAnswersObjectsList[i];
        let votedAnswerQuestion = await questionsData.getQuestionById(votedAnswer["questionId"])
        let votedAnswerQuestionName = votedAnswerQuestion["content"];
        let votedAnswerQuestionUrl = `question/${votedAnswerQuestion["_id"]}`;
        let recentUpdatedTime
        = new Date(votedAnswer["recentUpdatedTime"]).toDateString();
        let IsVoteUp = false;
        if(votedAnswer["voteUp"].indexOf(user["_id"].toString()) != -1){
            IsVoteUp = true;
        }
        // let IsVoteUp = await answersData.judgeVoteUpInAnswers(user["_id"].toString());

        userVotedAnswersList.push({
            votedAnswerId: votedAnswer._id.toString(),
            VotedAnswerUserId: user["_id"].toString(),
            questionName: votedAnswerQuestionName,
            questionUrl: votedAnswerQuestionUrl,
            answerContent: votedAnswer["content"],
            numberOfVoteUp: votedAnswer["voteUp"].length,
            numberOfVoteDown: votedAnswer["voteDown"].length,
            recentUpdatedTime: recentUpdatedTime,
            IsVoteUp:IsVoteUp

        });
    }
    res.json({
        userVotedAnswersList:userVotedAnswersList
    });

});
router.post('/updateVoteAnswer', async(req,res) => {
    let answerId = xss(req.body.answerId);
    let userId = xss(req.body.userId);
    console.log(`update userId: ${userId} answerId: ${answerId}`);
    res.json({
        status: true
    });
});

//voted reviews
router.post('/getVotedReviews', async(req,res) => {
    let limit = parseInt(xss(req.body.limit));
    let sort = xss(req.body.sort);
    const userid = "5fd2b0e9f293b535faad70ea";
    //const userid = req.session.user._id
    const user = await usersData.getUserById(userid);
    let userVotedReviews = user["votedForReviews"];
    let userVotedReviewsObjectsList = [];
    let userVotedReviewsList = [];
    for(let i = 0; i < userVotedReviews.length; i++)
    {
        let votedReview = await reviewsData.getReviewById(userVotedReviews[i]);
        userVotedReviewsObjectsList.push(votedReview);
    }
    //Voted score of the review from high to low
    if(sort.split(" ")[0] === "Voted"){
        userVotedReviewsObjectsList = await reviewsData.sortReviewsByVote
(userVotedReviewsObjectsList, limit);
    }
    else{
        userVotedReviewsObjectsList = await reviewsData.sortReviewsByTime(userVotedReviewsObjectsList, limit);
    }
    
    for(let i = 0; i < userVotedReviewsObjectsList.length; i++)
    {
        let votedReview = userVotedReviewsObjectsList[i];
        let votedReviewAnswer = await answersData.getAnswerById(votedReview["answerId"]);
        let votedReviewAnswerQuestion = await questionsData.getQuestionById(votedReviewAnswer["questionId"])
        let votedReviewAnswerQuestionName = votedReviewAnswerQuestion["content"];
        let votedReviewAnswerQuestionUrl = `question/${votedReviewAnswerQuestion["_id"]}`;
        let recentUpdatedTime
        = new Date(votedReview["recentUpdatedTime"]).toDateString();
        let IsVoteUp = false;
        if(votedReview["voteUp"].indexOf(user["_id"].toString()) != -1){
            IsVoteUp = true;
        }
        // let IsVoteUp = await answersData.judgeVoteUpInAnswers(user["_id"].toString());

        userVotedReviewsList.push({
            votedReviewId: votedReview._id.toString(),
            VotedReviewUserId: user["_id"].toString(),
            questionName: votedReviewAnswerQuestionName,
            questionUrl: votedReviewAnswerQuestionUrl,
            answerContent: votedReviewAnswer["content"],
            reviewContent: votedReview["content"],
            numberOfVoteUp: votedReview["voteUp"].length,
            numberOfVoteDown: votedReview["voteDown"].length,
            recentUpdatedTime: recentUpdatedTime,
            IsVoteUp:IsVoteUp

        });
    }
    res.json({
        userVotedReviewsList:userVotedReviewsList
    });

});
router.post('/updateVoteReview', async(req,res) => {
    let reviewId = xss(req.body.reviewId);
    let userId = xss(req.body.userId);
    console.log(`update userId: ${userId} reviewId: ${reviewId}`);
    res.json({
        status: true
    });
});
module.exports = router;