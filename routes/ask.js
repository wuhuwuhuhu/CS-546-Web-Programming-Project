const express = require('express');
const router = express.Router();
const data = require('../data');
const questionsData = data.questions;
const session = require('express-session');
const mongoCollections = require('../config/mongoCollections');
const systemCollection = mongoCollections.systemConfigs;
const test = false;
//const topics = ['Programming Languages','Machine Learning','Database','Web Programming','Others']
let topics = []
router.get('/', async(req,res) =>{
    const topicCollection = await systemCollection();
    const find = await topicCollection.findOne({topics:{$exists:true}})
    if(find == null){
        res.status(404).json('topics initial wrong.')
    }
    topics = find.topics;
    res.render('ask/ask',{topic:topics});

})

router.post('/', async (req, res) => {
    const quesInfo = req.body;
    console.log(quesInfo)
    let errors = []
    if (!quesInfo) {
        const errorMsg = "You need to write something for the question";
        errors.push(errorMsg);

    }
    //------Test Code ------------
    if(test){
        req.session.user = Object.assign({}, {_id:'5fb7f013d1fad944a36029d1',userName:"TestUser"});
    }
    //-----------------------------
    if (!req.session.user) {
        //if user not exist, redirect to login page
        res.status(403).redirect('/login')
        return;
    }
    let questioner = req.session.user._id;
    let content = req.body.question;
    if (!content) {
        const errorMsg = 'You need to ask something';
        errors.push(errorMsg);
    }
    let topic = req.body.topic;
    if (!topic) {
        const errorMsg = 'You need to select a topic';
        errors.push(errorMsg);
    }
    // console.log(quesInfo);
    if(errors.length> 0){
        res.render('ask/ask', { errors: errors, topic: topics, question: content });
        return;
    }

    try {
        const newQuestion = await questionsData.addQuestion(content, topic, questioner);
        //send question id to the link for user to view
        res.render('ask/askSuccess', { questionId: newQuestion._id });
    } catch (error) {
        console.log(error);
        const errorMsg = "Ask question failed."
        errors.push(errorMsg);
        res.render('ask/ask', { errors: errors, topic: topic, question: content });
        return;
    }



})
module.exports=router;
