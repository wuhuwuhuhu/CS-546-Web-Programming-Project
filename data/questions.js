const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;

let exportedMethods = {
    async getAllQuestions() {},
    async getQuestionById(id) {
        const questionsCollection = await questions();
        if(typeof id === "string")
        {
            let { ObjectId } = require("mongodb");
            id = ObjectId(id);
        }
        const questionfinded = await questionsCollection.findOne({ _id: id });
        if (questionfinded === null) throw `Error: No question with that id ${id}`;
        return questionfinded;
    },
    async addQuestion(content, topic, questioner) {
        //check whether QuestionName duplicated
        //generate _id, questionCreatedTime
        //generate empty arryays for answersId
    },
    async removeQuestion(id) {
        //also remove comments related to the Question. 
    },
    async updateQuestion(id, content, topic) {},

    async addAnswer(id, answerId){},
    async removeAnswer(id, answerId){},
};

module.exports = exportedMethods;