const express = require('express');
const router = express.Router();
const data = require('../data');
const answerDate = data.answers;
const questionsData = data.questions;
const userData = data.users;
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
        // if(req.session.user){
        // }
        let id = req.params.id;
        const question = await questionsData.getQuestionById(id)
        console.log(question);
        questionContent = question.content
        const answersId = question.answers
        let answersInQuestion = new Array()
        console.log(answersId);
        for (let index = 0; index < answersId.length; index++) {
            let curAnswerId = answersId[index];
            answersInQuestion.push(await answerDate.getAnswerById(curAnswerId))
        }
        console.log(answersInQuestion);
        res.json("done")
    } catch (error) {
        res.json("didn't find question")
    }
});




module.exports = router;