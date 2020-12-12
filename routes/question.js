const express = require('express');
const router = express.Router();
const data = require('../data');
const answerDate = data.answers;
const questionsData = data.questions;
const userData = data.users;
const reviewDate = data.reviews;
const session = require('express-session');


/**
 * get all info of the question
 * 1.   user
 * 2.   questionContent: question.content
 * 3.   answersInQuestion[]: question.answers
 * 4.   reviewsInAnswers[][]: answersanswers
 */
router.get('/:id', async (req, res) => {
    try {
        let userId = req.session.user
        let id = req.params.id;
        const question = await questionsData.getQuestionById(id)
        console.log(question);
        questionContent = question.content
        const answersId = question.answers
        let answersInQuestion = new Array()
        let reviewsInAnswers = new Array()
        for (let index = 0; index < answersId.length; index++) {
            let curReviewsInAnswers = new Array()
            let curAnswerId = answersId[index];
            let curAnswer = await answerDate.getAnswerById(curAnswerId)
            answersInQuestion.push(curAnswer)
            let curReviewIdArray = curAnswer.reviews
            for (let j = 0; j < curReviewIdArray.length; j++) {
                let curReviewId = curReviewIdArray[j];
                let curReview = await reviewDate.getReviewById(curReviewId)
                curReviewsInAnswers.push(curReview)
            }
            reviewsInAnswers.push(curReviewsInAnswers)
        }
        res.render('questionDetails/questionInfo.handlebars', {
            userId: userId,
            answersInQuestion: answersInQuestion,
            reviewsInAnswers: reviewsInAnswers,
        });
    } catch (error) {
        res.json("didn't find question")
    }
})


/**
 * add a new answer question 
 * questionId: id of target question
 */
router.post('/addAnswer/:questionId', async (req, res) => {

})

/**
 * add a new review to answer which under a question
 */
router.post('/addReview/:questionId/:answerId', async (req, res) => {

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
    ;






module.exports = router;