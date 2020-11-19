const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
const ObjectId = require('mongodb').ObjectId;

let exportedMethods = {
    /**
    * get all questions from questions table as Array
    */
    async getAllQuestions() {
        const questionsCollection = await questions();
        const questionsList = await questionsCollection.find({}).toArray();
        return questionsList;
    },
    /**
     * 
     * @param {*} id 
     * return a question as document by id in question table
     * return null if did't find result
     */
    async getQuestionById(id) {
        if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/)) {
            throw 'id of /data/questions.js/getQuestionById is not String or legal input ';
        }
        const rquestionsCollection = await questions();
        try {
            const questionById = await rquestionsCollection.findOne({ _id: ObjectId(id) });
            return questionById;
        } catch (error) {
            console.log("there is an error in /data/questions.js/getQuestionById");
            return null
        }
    },
    async addQuestion(content, topic, questioner) {
        //check whether QuestionName duplicated
        //generate _id, questionCreatedTime
        //generate empty arryays for answersId
    },
    async removeQuestion(id) {
        //also remove comments related to the Question. 
    },
    async updateQuestion(id, content, topic) { },

    async addAnswer(id, answerId) { },
    async removeAnswer(id, answerId) { },
};

module.exports = exportedMethods;