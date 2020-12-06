const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const answers = mongoCollections.anwsers;
const questionsMethods=require('./questions')

let exportedMethods = {

    async getAllAnswers() {
        const answersCollection = await answers();
        const answersList = await answersCollection.find({}).toArray();
        return answersList;
    },
    async getAnswerById(id) {
        if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/)) {
            throw `id of /data/answers.js/getAnswerById is not String or legal input`
        }
        const answersCollection = await answers();
        try {
            const answerById = await answersCollection.findOne({ _id: ObjectId(id) });
            return answerById;
        } catch (error) {
            throw `there is an error in /data/answers.js/getAnswerById`
        }
    },
    async addAnswer(content, answerer, questionId) {
        //check whether AnswerName duplicated
        //generate recentUpdatedTime
        //generate empty arryays for reviews voteUp voteDown
        var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        if (!content || content == null || typeof content != 'string' || content.match(/^[ ]*$/)) {
            throw `content in /data/answers.js/addAnswer is blank`
        }
        if (!answerer || answerer == null || typeof answerer != 'string' || answerer.match(/^[ ]*$/)||!ObjectIdExp.test(answerer)) {
            throw `answerer in /data/answers.js/addAnswer is blank or not match Object`
        }
        if (!questionId || questionId == null || typeof questionId != 'string' || questionId.match(/^[ ]*$/) || !ObjectIdExp.test(questionId)) {
            throw `questionId in /data/answers.js/addAnswer has error`
        }
        try {
            if(questionsMethods.getQuestionById(questionId)==null){
                throw `did not find question by id ${questionId} in answers/addAnswer`
            }
            const realDate = new Date()
            let voteUpArr = []
            let voteDownArr = []
            const newAnswer = {
                content: content,
                recentUpdatedTime: realDate,
                answerer: answerer,
                questionId: questionId,
                voteUp: voteUpArr,
                voteDown: voteDownArr
            }
            const answersCollection = await answers();
            const insertInfor = await answersCollection.insertOne(newAnswer);
            if (insertInfor.insertedCount === 0) {
                throw 'Insert failed!';
            }
            const newId = insertInfor.insertedId;
            // add answer to question
            const answerAdded=await questionsMethods.addAnswer(questionId,answerer)
            if (answerAdded == null) {
                throw 'Insert failed!';
            }
            const ans = await this.getAnswerById(newId.toString());
            return ans
            
        } catch (error) {
            throw error
        }
    },
    async removeAnswer(id,userId) {
        //also remove comments related to the Answer. 
        // var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        // if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/)||!ObjectIdExp.test(id)) {
        //     throw `id in /data/answers.js/removeAnswer is blank or not match Object`
        // }
        
    },
    
    async updateAnswer(id, content) {},

    async addReview(id, reviewId){},
    async removeReview(id, reviewId){},

    async addVoteUp(id, voterId){},
    async removeVoteUp(id, voterId){},

    async addVoteDown(id, voterId){},
    async removeVoteDown(id, voterId){}
};

module.exports = exportedMethods;