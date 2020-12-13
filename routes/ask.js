const express = require('express');
const router = express.Router();
const data = require('../data');
const questionsData = data.questions;
const session = require('express-session');
const mongoCollections = require('../config/mongoCollections');
const systemConfigs = mongoCollections.systemConfigs;
const questions = mongoCollections.questions;
const xss = require('xss');
//test mode setting, assign a dummy user
const test = false;

let topics = []
router.get('/', async (req, res) => {
	const topicCollection = await systemConfigs();
	const find = await topicCollection.findOne({ topics: { $exists: true } })
	if (find == null) {
		res.status(404).json('topics initial wrong.')
	}
	topics = find.topics;
	res.render('ask/ask', { topic: topics });

})

router.post('/', async (req, res) => {
	const quesInfo = req.body;
//	console.log(quesInfo)
	let errors = []
	if (!quesInfo) {
		const errorMsg = "You need to write something for the question";
		errors.push(errorMsg);

	}
	//------Test Code ------------
	if (test) {
		req.session.user = Object.assign({}, { _id: '5fd4fdf681b3bb139040e42f', userName: "TestUser" });
	}
	//-----------------------------
	if (!req.session.user) {
		//if user not exist, redirect to login page
		res.status(403).redirect('/login')
		return;
	}
	let questioner = xss(req.session.user._id);
	let content = xss(req.body.question);
	if (!content) {
		const errorMsg = 'You need to ask something';
		errors.push(errorMsg);
	}

	//check topic selection
	let topic = xss(req.body.topic);
	if (!topic) {
		const errorMsg = 'You need to select a topic';
		errors.push(errorMsg);
	}
	const topicCollection = await systemConfigs();
	const findTopic = await topicCollection.findOne({ topics: { $exists: true } })
	if (findTopic == null) {
		res.status(404).json('topics initial wrong.')
	}
	topics = findTopic.topics;

	//check whether QuestionName duplicated
	const questionCollection = await questions();
	const findQuestion = await questionCollection.findOne({ content: content })
	if (findQuestion) {
		const errorMsg = 'Question already exists.';
		errors.push(errorMsg);
		//if there is already same question, show a link to the exist question
		const qId = findQuestion._id.toString();
		res.render('ask/ask', { errors: errors, topic: topics, question: content, oldQuestionId:qId  });
		return;
	}
	// console.log(quesInfo);
	if (errors.length > 0) {
		res.render('ask/ask', { errors: errors, topic: topics, question: content });
		return;
	}

	try {
		console.log(content)
		console.log(topic)
		console.log(questioner)
		const newQuestion = await questionsData.addQuestion(content, topic, questioner);
		res.render('ask/askSuccess', { questionId: newQuestion._id.toString() });
		console.log(newQuestion._id.toString())
	} catch (error) {
	
		const errorMsg = "Ask question failed."
		errors.push(error);
		res.render('ask/ask', { errors: errors, topic: topics, question: content });
		return;
	}



})
module.exports = router;
