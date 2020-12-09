const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
const answers = mongoCollections.answers;
const users = mongoCollections.users;
const reviews = mongoCollections.reviews;
const usersData = require('./users')


//helper method--parse id to objectId
async function myDBfunction(id) {
	//check to make sure we have input at all
	if (!id) throw 'Error: Id parameter must be supplied';
	//check to make sure it's a string
	if (typeof id !== 'string') throw "Error: Id must be a string";

	let { ObjectId } = require('mongodb')
	let parsedId = ObjectId(id);
	return parsedId
}

let exportedMethods = {
	//get all questions in a list
	async getAllQuestions() {
		const questionCollection = await questions();
		const questionList = await questionCollection.find({}).toArray();
		//change objectId to string id
		for (let i = 0; i < questionList.length; i++) {
			questionList[i]._id = questionList[i]._id.toString()
		}
		return questionList;
	},

	//get question by id
	async getQuestionById(id) {
		if (!id) throw 'questions.js|getQestionById(): you need to provide an id.'
		if (typeof id !== 'string' || id.trim() === '') throw 'questions.js|getQestionById(): id must be non-empty string'

		const questionCollection = await questions();
		const ObjectId = await myDBfunction(id);
		const find = await questionCollection.findOne({ _id: ObjectId });
		if (find == null) throw 'questions.js|getQestionById():question not found';
		//change objectId to string id
		const result = Object.assign({}, find);
		result._id = find._id.toString();

		return result;
	},

	//create a new question
	//update users db, add question id to user.questions
	async addQuestion(content, topic, questioner) {
		if (!content || !topic || !questioner) {
			throw 'questions.js|addQuestion():You need to provide all the question fields'
		}
		if (typeof content !== 'string' || content.trim() === '') {
			throw 'questions.js|addQuestion():Question content must be non-empty string'
		}

		if (typeof topic !== 'string' || topic.trim() === '') {
			throw 'questions.js|addQuestion(): must be non-empty string'
		}

		if (typeof questioner !== 'string' || questioner.trim() === '') {
			throw 'questions.js|addQuestion():questioner must be non-empty string'
		}

		//generate empty arryays for answersId
		let date = new Date()
		let newQuestion = {
			content: content.trim(),
			topic: topic.trim(),
			questioner: questioner.trim(),
			questionCreatedTime: date,
			answers: []
		}
		const questionCollection = await questions();
		//check whether QuestionName duplicated
		const find = await questionCollection.findOne({ content: content.trim() })
		if (find) throw 'questions.js|addQuestion():Error: there is already a same question'
		//insert new question to db
		const insertInfo = await questionCollection.insertOne(newQuestion);
		if (insertInfo.insertedCount === 0) throw 'questions.js|addQuestion():Error: could not add question'
		let newId = insertInfo.insertedId.toString()

		//  add question Id to user.questions[]
		let userObjectId = await myDBfunction(questioner);
		const userCollection = await users();
		const updatedInfo = await userCollection.updateOne({ _id: userObjectId }, { $addToSet: { questions: newId } })
		if (updatedInfo.matchedCount === 0 || updatedInfo.modifiedCount === 0) {
			throw 'questions.js|addQuestion():No user being updated.'
		}
		//using method from users.js
		//        try {
		//            const updatedUser = await usersData.addQuestion(questioner,newId);
		//        } catch (error) {
		//
		//            console.log(error);
		//            throw 'questions.js|addQuestion(): could not update user';
		//        }

		//change id to string for output use
		let result = Object.assign({}, newQuestion);
		result['_id'] = newId;

		//change dateformat for output use
		// let outputDate = formatDate(newBook.datePublished)
		//  result.datePublished = outputDate
		return result


	},

	//remove question
	//remove related answers, reviews
	//remove question id from user db
	async removeQuestion(id) {
		if (!id) throw 'questions.js|removeQuestion(): you need to provide an id'
		if (typeof id !== 'string' || id.trim() === '') throw 'questions.js|removeQuestion(): id must be non-empty string'

		const question = await this.getQuestionById(id);
		if (question == null) throw `questions.js|removeQuestion(): question with ${id} not found`
		//  remove answers first
		if (question.answers.length !== 0) {
			//loop the answers array to delete all the related answers;
			for (let answerId of question.answers) {
				const answerCollection = await answers();
				const answerObjectId = await myDBfunction(answerId);
				const findAnswer = await answerCollection.findOne({ _id: answerObjectId });
				if (findAnswer == null) throw 'questions.js|removeQuestion():answer not found';
				// remove related reviews
				if (findAnswer.reviews.length !== 0) {
					let reviewsList = findAnswer.reviews;
					for (let reviewId of reviewsList) {
						const reviewCollection = await reviews();
						let reviewObjectId = await myDBfunction(reviewId);
						const deleteReviewInfo = await reviewCollection.deleteOne({ _id: reviewObjectId });
						if (deleteReviewInfo.deletedCount === 0) throw 'questions.js|removeQuestion(): no reviews been deleted.'
					}
				}
				const deleteAnswerInfo = await answerCollection.deleteOne({ _id: answerObjectId })
				if (deleteAnswerInfo.deletedCount === 0) throw 'questions.js|removeQuestion(): no answers been deleted.'

			}
		}
		return question
	},

	//update question 
	async updateQuestion(id, content, topic) {
		if (!id || !content || !topic) throw 'questions.js|updateQeustion: id, content, topic cannot be empty.'
		if (typeof id !== 'string' || id.trim() === '') throw 'questions.js|updateQeustion: id should be non-empty string'
		if (typeof content !== 'string' || content.trim() === '') throw 'questions.js|updateQeustion: id should be non-empty string'
		if (typeof topic !== 'string' || topic.trim() === '') throw 'questions.js|updateQeustion: topic should be non-empty string'

		const questionCollection = await questions()
		const findQuestion = await questionCollection.getQuestionById(id.trim())
		//if(findQuestion == null) throw 'question.js|updateQuestion(): question not found.'
		const objectId = await myDBfunction(id.trim())
		const updateInfo = await questionCollection.updateOne({ _id: objectId }, { $set: { content: content.trim(), topic: topic.trim() } })
		if (updateInfo.matchedCount === 0) throw `questions.js|updateQeustion(): question ${id} not found`
		if (updateInfo.modifiedCount === 0) throw `questions.js|updateQeustion(): Nothing been updated.`

		const updatedQuestion = await this.getQuestionById(id);
		return updatedQuestion;

	},

	// add answer id to questions db
	async addAnswer(id, answerId) {
		if (!id || !answerId) throw 'questions.js|addAnswer(): input id and answerId should not be empty'
		if (typeof id !== 'string' || id.trim() === '') throw 'questions.js|addAnswer(): id must be non-empty string'
		if (typeof answerId !== 'string' || answerId.trim() === '') throw 'questions.js|addAnswer(): id must be non-empty string'
		const questionCollection = await questions();
		const objectId = await myDBfunction(id.trim())
		const updateInfo = await questionCollection.updateOne({ _id: objectId }, { $addToSet: { answers: answerId } })
		if (updateInfo.matchedCount === 0) throw `questions.js|updateQeustion(): question ${id} not found`
		if (updateInfo.modifiedCount === 0) throw `questions.js|updateQeustion(): Nothing been updated.`

		const updatedQuestion = await this.getQuestionById(id);
		return updatedQuestion;
	},

	//remove answer id from questions db
	async removeAnswer(id, answerId) {
		if (!id || !answerId) throw 'questions.js|addAnswer(): input id and answerId should not be empty'
		if (typeof id !== 'string' || id.trim() === '') throw 'questions.js|addAnswer(): id must be non-empty string'
		if (typeof answerId !== 'string' || answerId.trim() === '') throw 'questions.js|addAnswer(): id must be non-empty string'
		const questionCollection = await questions();
		const objectId = await myDBfunction(id.trim())

		const updateInfo = await questionCollection.updateOne({ _id: objectId }, { $pull: { answers: answerId } })
		if (updateInfo.matchedCount === 0) throw `questions.js|updateQeustion(): question ${id} not found`
		if (updateInfo.modifiedCount === 0) throw `questions.js|updateQeustion(): Nothing been updated.`

		const updatedQuestion = await this.getQuestionById(id);
		return updatedQuestion;
	},

	//copyied from answers.js
	// modified for test purpose 12-07-2020
	async addAnswer2(content, answerer, questionId) {
        //check whether AnswerName duplicated
        //generate recentUpdatedTime
        //generate empty arryays for reviews voteUp voteDown
        var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        if (!content || content == null || typeof content != 'string' || content.match(/^[ ]*$/)) {
            throw `content in /data/answers.js/addAnswer is blank`
        }
        if (!answerer || answerer == null || typeof answerer != 'string' || answerer.match(/^[ ]*$/) || !ObjectIdExp.test(answerer)) {
            throw `answerer in /data/answers.js/addAnswer is blank or not match Object`
        }
        if (!questionId || questionId == null || typeof questionId != 'string' || questionId.match(/^[ ]*$/) || !ObjectIdExp.test(questionId)) {
            throw `questionId in /data/answers.js/addAnswer has error`
        }
        try {
            if (this.getQuestionById(questionId) == null) {
                throw `did not find question by id ${questionId} in answers/addAnswer`
            }
            const realDate = new Date()
            let voteUpArr = []
			let voteDownArr = []
			let reviewsArr=[]
            const newAnswer = {
                content: content,
                recentUpdatedTime: realDate,
                answerer: answerer,
				questionId: questionId,
				reviews:reviewsArr,
                voteUp: voteUpArr,
                voteDown: voteDownArr
            }
            const answersCollection = await answers();
            const insertInfor = await answersCollection.insertOne(newAnswer);
            if (insertInfor.insertedCount === 0) {
                throw 'Insert failed!';
            }
            const newId = insertInfor.insertedId.toString();
            // add answer to question
            const answerAddedInQus = await this.addAnswer(questionId, newId)
            if (answerAddedInQus == null) {
                throw 'Insert failed!';
            }
			//update user
			const userCollection = await users();
			const objectAnswererId = await myDBfunction(answerer)
			const updateInfo = await userCollection.updateOne({_id:objectAnswererId},{$addToSet:{answers:newId}})
			if (updateInfo.matchedCount === 0) throw `questions.js|addAnswer(): question ${answerer} not found`
			if (updateInfo.modifiedCount === 0) throw `questions.js|addAnswer(): Nothing been updated.`
            //const ans = await this.getAnswerById(newId.toString());
            //return ans

        } catch (error) {
            throw error
        }
    },
};

module.exports = exportedMethods;
