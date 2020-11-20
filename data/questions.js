const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
const users = mongoCollections.users;


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
    async getAllQuestions() { },
    async getQuestionById(id) { },
    async addQuestion(content, topic, questioner) {
        if (!content || !topic || !questioner) {
            throw 'You need to provide all the question fields'
        }
        if (typeof content !== 'string' || content.trim() === '') {
            throw 'Question content must be non-empty string'
        }

        if (typeof topic !== 'string' || topic.trim() === '') {
            throw 'Topic must be non-empty string'
        }

        if (typeof questioner !== 'string' || questioner.trim() === '') {
            throw 'questioner must be non-empty string'
        }
        const objectId = await myDBfunction(questioner)
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
        if (find) throw 'Error: there is already a same question'
        //insert new question to db
        const insertInfo = await questionCollection.insertOne(newQuestion);
        if (insertInfo.insertedCount === 0) throw 'Error: could not add question'
        let newId = insertInfo.insertedId.toString()

        //add question Id to user.questions[]
        let userObjectId = await myDBfunction(questioner);
        const userCollection = await users();
        const updatedInfo = await userCollection.updateOne({ _id: userObjectId }, { $addToSet: { questions: newId } })
        if (updatedInfo.matchedCount === 0 || updatedInfo.modifiedCount === 0) {
            throw 'No user being updated.'
        }
        //change id to string for output use
        let result = Object.assign({}, newQuestion);
        result['_id'] = newId;

        //change dateformat for output use
        // let outputDate = formatDate(newBook.datePublished)
        //  result.datePublished = outputDate
        return result


    },
    async removeQuestion(id) {
        //also remove comments related to the Question.
    },
    async updateQuestion(id, content, topic) { },

    async addAnswer(id, answerId) { },
    async removeAnswer(id, answerId) { },
};

module.exports = exportedMethods;
