const express = require('express');
const router = express.Router();
const data = require('../data');
const answerDate = data.answers;
const questionsData = data.questions;
const userData = data.users;
const reviewDate = data.reviews;
const session = require('express-session');
const { ObjectId } = require('mongodb');
const xss = require('xss');

/**
 * get all info of the question
 * 1.   user
 * 2.   questionContent: question.content
 * 3.   answersInQuestion[]: question.answers
 * 4.   reviewsInAnswers[][]: answersanswers
 *  question={
 *  questionObj:
 *  answers :[{
 *      answerId:
 *      reviews:[{
 * }]
 * }]
 * }
 */
router.get('/:id', async (req, res) => {
    try {
        let userId = xss(req.session.user)
        userId = "5fd2bcbadc020240556f3a8e"
        let id = xss(req.params.id)
        const question = await questionsData.getQuestionById(id)
        questionContent = question.content
        const answersId = question.answers
        let answersInQuestion = new Array()     //obj array 
        for (let index = 0; index < answersId.length; index++) {
            let curReviewsInAnswers = new Array()
            let curAnswerId = answersId[index];
            let curAnswer = await answerDate.getAnswerById(curAnswerId)
            let curReviewIdArray = curAnswer.reviews
            for (let j = 0; j < curReviewIdArray.length; j++) {
                let curReviewId = curReviewIdArray[j];
                let curReview = await reviewDate.getReviewById(curReviewId)
                curReview.recentUpdatedTime = await answerDate.transferData(curReview.recentUpdatedTime)
                curReview.voteUpNumber = curReview.voteUp.length
                curReview.voteDownNumber = curReview.voteDown.length
                curReview.voteUpJudge = await reviewDate.judgeVoteUpInReviews(userId, curReviewId)
                curReview.voteDownJudge = await reviewDate.judgeVoteDownInReviews(userId, curReviewId)
                curReviewsInAnswers.push(curReview)
            }
            let answerObj = new Object()
            answerObj.answerId = curAnswerId
            answerObj.content = curAnswer.content
            answerObj.reviews = curReviewsInAnswers
            answerObj.recentUpdatedTime = await answerDate.transferData(curAnswer.recentUpdatedTime)
            answerObj.voteUpNumber = curAnswer.voteUp.length
            answerObj.voteDownNumber = curAnswer.voteDown.length
            answerObj.voteUpJudge = await answerDate.judgeVoteUpInAnswers(userId, curAnswerId)
            answerObj.voteDownJudge = await answerDate.judgeVoteDownInAnswers(userId, curAnswerId)
            answersInQuestion.push(answerObj)
        }
        res.render('questionDetails/questionInfo.handlebars', {
            userId: userId,
            questionId: id,
            questionText: question.content,
            answersInQuestion: answersInQuestion,
        });
    } catch (error) {
        throw error
        res.json("didn't find question")
    }
})


/**
 * add a new answer question 
 * questionId: id of target question
 */
router.post('/addAnswer/:questionId', async (req, res) => {
    try {
        let userId = xss(req.session.user)
        userId = "5fd2bcbadc020240556f3a8e";
        let questionId = xss(req.params.questionId);
        let content = xss(req.body.content)
        const newAnswer = await answerDate.addAnswer(content, userId, questionId)
        const newAnswerList = await transferData(questionId,req,res,userId)
        res.json({
            status: true,
            newAnswerList: newAnswerList
        });
    } catch (error) {
        throw error
    }
})

/**
 * add a new review to answer which under a question
 */
router.post('/addReview/:questionId/:answerId', async (req, res) => {
    let userId = xss(req.session.user)
    userId = "5fd2bcbadc020240556f3a8e";
    let content = xss(req.body.content)
    let questionId = xss(req.params.questionId);
    let answerId = xss(req.params.answerId);
    const newReview = await reviewDate.addReview(content, userId, answerId)
    res.json({

    });
})

/**
 * vote up an answer
 */
router.post('/voteUpAnswer/:questionId/:answerId', async (req, res) => {

})

/**
 * vote down an answer
 */
router.post('/voteDownAnswer/:questionId/:answerId', async (req, res) => {

})

/**
 * vote up an review
 */
router.post('/voteUpReview/:questionId/:answerId/:reviewId', async (req, res) => {

})

/**
 * vote down an review
 */
router.post('/voteDownReview/:questionId/:answerId/:reviewId', async (req, res) => {

})


async function transferData(questionId,req, res,userId) {
    const question = await questionsData.getQuestionById(questionId)
    questionContent = question.content
    const answersId = question.answers
    let answersInQuestion = new Array()     //obj array 
    for (let index = 0; index < answersId.length; index++) {
        let curReviewsInAnswers = new Array()
        let curAnswerId = answersId[index];
        let curAnswer = await answerDate.getAnswerById(curAnswerId)
        let curReviewIdArray = curAnswer.reviews
        for (let j = 0; j < curReviewIdArray.length; j++) {
            let curReviewId = curReviewIdArray[j];
            let curReview = await reviewDate.getReviewById(curReviewId)
            curReview.recentUpdatedTime = await answerDate.transferData(curReview.recentUpdatedTime)
            curReview.voteUpNumber = curReview.voteUp.length
            curReview.voteDownNumber = curReview.voteDown.length
            curReview.voteUpJudge = await reviewDate.judgeVoteUpInReviews(userId, curReviewId)
            curReview.voteDownJudge = await reviewDate.judgeVoteDownInReviews(userId, curReviewId)
            curReviewsInAnswers.push(curReview)
        }
        let answerObj = new Object()
        answerObj.answerId = curAnswerId
        answerObj.content = curAnswer.content
        answerObj.reviews = curReviewsInAnswers
        answerObj.recentUpdatedTime = await answerDate.transferData(curAnswer.recentUpdatedTime)
        answerObj.voteUpNumber = curAnswer.voteUp.length
        answerObj.voteDownNumber = curAnswer.voteDown.length
        answerObj.voteUpJudge = await answerDate.judgeVoteUpInAnswers(userId, curAnswerId)
        answerObj.voteDownJudge = await answerDate.judgeVoteDownInAnswers(userId, curAnswerId)
        answersInQuestion.push(answerObj)
    }
    return answersInQuestion
}
;






module.exports = router;