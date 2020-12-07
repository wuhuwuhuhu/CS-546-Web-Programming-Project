const e = require('express');
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const answers = mongoCollections.anwsers;
const reviews = mongoCollections.reviews;
const questionsMethods = require('./questions')
const usersMethods = require("./users");

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
        if (!answerer || answerer == null || typeof answerer != 'string' || answerer.match(/^[ ]*$/) || !ObjectIdExp.test(answerer)) {
            throw `answerer in /data/answers.js/addAnswer is blank or not match Object`
        }
        if (!questionId || questionId == null || typeof questionId != 'string' || questionId.match(/^[ ]*$/) || !ObjectIdExp.test(questionId)) {
            throw `questionId in /data/answers.js/addAnswer has error`
        }
        try {
            if (questionsMethods.getQuestionById(questionId) == null) {
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
            const answerAddedInQus = await questionsMethods.addAnswer(questionId, newId)
            if (answerAddedInQus == null) {
                throw 'Insert failed!';
            }
            //update user
            const answerAddedInUsr = await usersMethods.addAnswer(answerer, newId)
            const ans = await this.getAnswerById(newId.toString());
            return ans

        } catch (error) {
            throw error
        }
    },
    async removeAnswer(id, userId, questionId) {
        //also remove comments related to the Answer. 
        try {
            var ObjectIdExp = /^[0-9a-fA-F]{24}$/
            if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/) || !ObjectIdExp.test(id)) {
                throw `id in /data/answers.js/removeAnswer is blank or not match Object`
            }
            if (!userId || userId == null || typeof userId != 'string' || userId.match(/^[ ]*$/) || !ObjectIdExp.test(userId)) {
                throw `userId in /data/answers.js/removeAnswer is blank or not match Object`
            }
            if (!questionId || questionId == null || typeof questionId != 'string' || questionId.match(/^[ ]*$/) || !ObjectIdExp.test(questionId)) {
                throw `questionId in /data/answers.js/removeAnswer is blank or not match Object`
            }
            const answer = await this.getAnswerById(id)
            if (answer == null) {
                throw `did not find answer by id ${id} in answer/removeAnswer`
            }
            let reviewArray = answer.reviews
            const reviewsCollection = await reviews();
            for (let i = 0; i < reviewArray.length; i++) {
                let rewId = reviewArray[i]
                let curRewDeletedInReview = await reviewsCollection.deleteOne({ _id: ObjectId(rewId) });
                if (curRewDeletedInReview.deletedCount === 0) {
                    throw `Failed to delete review by id ${rewId} in answer/removeAnswer`
                }
                //update user review
                let curRewDeletedInUsr = await usersMethods.removeReview(userId, rewId)
                if (curRewDeletedInUsr == null) {
                    throw `Failed to update user by deleting review by id ${rewId} in answer/removeAnswer`
                }
            }
            //delete answer
            const answersCollection = await answers()
            let answerDeleted = await answersCollection.deleteOne({ _id: ObjectId(id) });
            if (answerDeleted == null) {
                throw `Failed to delete answer by id ${id} in answer/removeAnswer`
            }
            //update user answer
            let curAnsDeletedInUsr = await usersMethods.removeAnswer(userId, id)
            if (curAnsDeletedInUsr == null) {
                throw `Failed to update answer by deleting review by id ${rewId} in answer/removeAnswer`
            }
            //update question
            let curRewDeletedInQus = await questionsMethods.removeAnswer(questionId, id)
            if (curRewDeletedInQus == null) {
                throw `Failed to update question by deleting review by id ${rewId} in answer/removeAnswer`
            }
        } catch (error) {
            throw error
        }
    },

    async updateAnswer(id, content) {
        try {
            const answersCollection = await answers()
            var ObjectIdExp = /^[0-9a-fA-F]{24}$/
            if (!id || typeof id != 'string' || id.match(/^[ ]*$/) || !ObjectIdExp.test(id)) {
                throw `id in /data/answer.js/updateAnswer has error`
            }
            if (!content || content == null || typeof content != 'string' || content.match(/^[ ]*$/)) {
                throw `content in /data/answer.js/updateAnswer is blank`
            }
            const oldAns = await this.getAnswerById(id)
            if (oldAns == null) {
                throw `didn't find answer by id : ${id}`
            }
            try {
                await answersCollection.updateOne({ _id: ObjectId(id) }, { $set: { 'content': content } });
                const newData = await this.getAnswerById(id)
                return newData
            } catch (error) {
                throw 'could not update answer successfully';
            }
        } catch (error) {
            throw error
        }
    },
    /**
     * 
     * @param {*} id : id of answer
     * @param {*} reviewId 
     * add a new review id to answer.reviews array
     */
    async addReview(id, reviewId) {
        try {
            const answersCollection = await answers()
            const updateInfo = await answersCollection.updateOne({ _id: id }, { $addToSet: { reviews: reviewId } })
            if (updateInfo.matchedCount === 0) {
                throw `did not find answer by id ${id} in answer.js/addReview`
            }
            if (updateInfo.modifiedCount === 0) {
                throw `failed to update answer by adding review in answer.js/addReview`
            }
            const updatedAnswer = await this.getAnswerById(id);
            return updatedAnswer;
        } catch (error) {
            throw error
        }
    },
    async removeReview(id, reviewId) {
        try {
            const answersCollection = await answers()
            const updateInfo = await answersCollection.updateOne({ _id: id }, { $pull: { reviews: reviewId } })
            if (updateInfo.matchedCount === 0) {
                throw `did not find answer by id ${id} in answer.js/addReview`
            }
            if (updateInfo.modifiedCount === 0) {
                throw `failed to update answer by adding review in answer.js/addReview`
            }
            const updatedAnswer = await this.getAnswerById(id);
            return updatedAnswer;
        } catch (error) {
            throw error
        }
    },

    async addVoteUp(id, voterId) {
        
     },
    async removeVoteUp(id, voterId) { },

    async addVoteDown(id, voterId) { },
    async removeVoteDown(id, voterId) { }
};

module.exports = exportedMethods;