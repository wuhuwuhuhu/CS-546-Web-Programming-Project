const reviews = require('../../Lab6/data/reviews');
const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
const answers = mongoCollections.anwsers;
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
    async getAllQuestions() {
        const questionCollection = await questions();
        const questionList = questionCollection.find({}).toArray();
        //change objectId to string id
        for (let i = 0; i < questionList.length; i++) {
            questionList[i]._id = questionList[i]._id.toString()
        }
        return questionList;
    },
    async getQuestionById(id) {
        if(!id) throw 'questions.js|getQestionById(): you need to provide an id.'
        if(typeof id !== 'string' || id.trim() === '') throw 'questions.js|getQestionById(): id must be non-empty string'

        const questionCollection = await questions();
        const ObjectId = await myDBfunction(id);
        const find = questionCollection.findOne({_id: ObjectId});
        if(find == null) throw 'questions.js|getQestionById():question not found';
        //change objectId to string id
        const result = Object.assign({},find);
        result._id = find._id.toString();

        return result;
    },
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
       // let userObjectId = await myDBfunction(questioner);
        // const userCollection = await users();
        // const updatedInfo = await userCollection.updateOne({ _id: userObjectId }, { $addToSet: { questions: newId } })
        // if (updatedInfo.matchedCount === 0 || updatedInfo.modifiedCount === 0) {
        //     throw 'No user being updated.'
        // }
        try {
            const updatedUser = await usersData.addQuestion(questioner,newId);
        } catch (error) {

            console.log(error);
            throw 'questions.js|addQuestion(): could not update user';
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
        if(!id) throw 'questions.js|removeQuestion(): you need to provide an id'
        if(typeof id !== 'string' || id.trim()==='') throw 'questions.js|removeQuestion(): id must be non-empty string'

        const question = this.getQuestionById(id);
        if(question == null) throw `questions.js|removeQuestion(): question with ${id} not found`
      //  remove answers first
        if(question.answers.length !==0 ){
            //loop the answers array to delete all the related answers;
            for(let answerId of question.answers){
                const answerCollection = await answers();
                const answerObjectId = await myDBfunction(answerId);
                const findAnswer = await answerCollection.findOne({_id:answerObjectId});
                if(findAnswer == null) throw 'questions.js|removeQuestion():answer not found';
                // remove related reviews
                if(findAnswer.reviews.length !== 0){
                    let reviewsList = findAnswer.reviews;
                    for(let reviewId of reviewsList){
                        const reviewCollection = await reviews();
                        let reviewObjectId = await myDBfunction(reviewId);
                        const deleteInfo = await reviewCollection.deleteOne({_id:reviewObjectId});

                    }
                }
                const deleteInfo = answerCollection.deleteOne({_id:answerObjectId})
                if(deleteInfo.deletedCount === 0) throw 'questions.js|removeQuestion(): no answers been deleted.'

            }
        }
    },
    async updateQuestion(id, content, topic) {
      
     },

    async addAnswer(id, answerId) { },
    async removeAnswer(id, answerId) { },
};

module.exports = exportedMethods;
