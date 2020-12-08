const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const usersMethods = require("./users");
const answersdMethods = require("./answers");
const questionMethods = require("./questions")
const e = require('express');
const ObjectId = require('mongodb').ObjectId;


let exportedMethods = {
    /**
     * get all reviews from reviews table as Array
     */
    async getAllReviews() {
        const reviewsCollection = await reviews();
        const reviewsList = await reviewsCollection.find({}).toArray();
        return reviewsList;
    },
    /**
     * 
     * @param {*} id 
     * return a review as document by id in review table
     * return null if did't find result
     */
    async getReviewById(id) {
        if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/)) {
            throw `id of /data/reviews.js/getReviewById is not String or legal input`
        }
        const reviewsCollection = await reviews();
        try {
            const reviewById = await reviewsCollection.findOne({ _id: ObjectId(id) });
            return reviewById;
        } catch (error) {
            throw `there is an error in /data/questions.js/getReviewById`
        }
    },
    /**
     * 
     * @param {*} content : the contene of review
     * @param {*} reviewer : the id of the user who write this review
     * @param {*} answerId : the id of the question be reviewed
     * check whether ReviewName duplicated
     * generate recentUpdatedTime(UTC)
     * generate empty arryays for reviews voteUp voteDown
     */
    async addReview(content, reviewer, answerId) {
        var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        if (!content || content == null || typeof content != 'string' || content.match(/^[ ]*$/)) {
            throw `content in /data/reviews.js/addReview is blank`
        }
        if (!reviewer || reviewer == null || typeof reviewer != 'string' || reviewer.match(/^[ ]*$/)|| !ObjectIdExp.test(reviewer)) {
            throw `reviewer in /data/reviews.js/addReview is blank or not match Object`
        }
        if (!answerId || answerId == null || typeof answerId != 'string' || answerId.match(/^[ ]*$/) || !ObjectIdExp.test(answerId)) {
            throw `answerId in /data/reviews.js/addReview has error`
        }
        try {
            if(answersdMethods.getAnswerById(answerId)==null){
                throw `did not find answer by id ${answerId} in reviews/addReview`
            }
            const realDate = new Date()
            let voteUpArr = []
            let voteDownArr = []
            const newReview = {
                content: content,
                recentUpdatedTime: realDate,
                Reviewer: reviewer,
                answerId: answerId,
                voteUp: voteUpArr,
                voteDown: voteDownArr
            }
            const reviewsCollection = await reviews();
            const insertInfor = await reviewsCollection.insertOne(newReview);
            if (insertInfor.insertedCount === 0) {
                throw 'Insert failed!';
            }
            const newId = insertInfor.insertedId.toString();
            //upadte answer
            const ansAndRev = await answersdMethods.addReview(answerId, newId);
            if (ansAndRev == null) {
                throw 'Insert failed!';
            }
            //update user (reviewer)
            const usrUpdate=await usersMethods.addReview(reviewer,newId)
            const review = await this.getReviewById(newId);
            return review
        } catch (error) {
            throw error
        }
    },
    async removeReview(id,userId,answerId,questionId) {
       try {
        var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/)||!ObjectIdExp.test(id)) {
            throw `id in /data/reviews.js/removeReview has error`
        }
        if (!userId || userId == null || typeof userId != 'string' || userId.match(/^[ ]*$/) || !ObjectIdExp.test(userId)) {
            throw `userId in /data/reviews.js/removeReview has error`
        }
        if (!answerId || answerId == null || typeof answerId != 'string' || answerId.match(/^[ ]*$/)||!ObjectIdExp.test(answerId)) {
            throw `answerId in /data/reviews.js/removeReview has error`
        }
        if (!questionId || questionId == null || typeof questionId != 'string' || questionId.match(/^[ ]*$/) || !ObjectIdExp.test(questionId)) {
            throw `questionId in /data/reviews.js/removeReview has error`
        }
        const rev = await this.getReviewById(id);
        if(rev!=null){
            const deletionInfo=await reviewsCollection.deleteOne({ _id: ObjectId(id) });
            if (deletionInfo.deletedCount === 0) {
                throw `Could not delete book with id of ${id}`;
            }
            //update answer
            const ansUpdate=await answersdMethods.removeReview(answerId,id)
            if(ansUpdate==null){
                throw `answer updated failed in reviews.js/removeReview`
            }
            //update question
            const queUpdate=await questionMethods.removeReview(questionId,id)
            if(queUpdate==null){
                throw `answer updated failed in reviews.js/removeReview`
            }
            //update user
            const usrUpdate=await usersMethods.removeReview(userId,id)
            if(usrUpdate==null){
                throw `user updated failed in reviews.js/removeReview`
            }
        }else{
            throw `did not find review by id ${id} in reviews/removeReview`
        }
       } catch (error) {
           throw error
       }
    },

    /**
     * 
     * @param {*} id : id of the review
     * @param {*} content : update the content
     */
    async updateReview(id, content) {
        const reviewsCollection = await reviews();
        var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        if (!id || typeof id != 'string' || id.match(/^[ ]*$/) || !ObjectIdExp.test(id)) {
            throw `id in /data/reviews.js/updateReview has error`
        }
        if (!content || content == null || typeof content != 'string' || content.match(/^[ ]*$/)) {
            throw `content in /data/reviews.js/updateReview is blank`
        }
        try {
            const oldReview = await this.getReviewById(id)
            if (oldReview == null) {
                throw `didn't find review by id : ${id}`
            }

            try {
                await reviewsCollection.updateOne({ _id: ObjectId(id) }, { $set: {'content':content}  });
                const newData = await this.getReviewById(id)
                return newData
            } catch (error) {
                throw 'could not update review successfully';
            }
        } catch (error) {
            throw error
        }
    },
    /**
     * 
     * @param {*} reviewId : id of review
     * @param {*} voterId : id of the voter
     * when this function used, if the user already "vote up" this review, then delete it, or add it if the user didn't "vote up " the review 
     */
    async updateVoteUp(reviewId, voterId) {
        const reviewsCollection = await reviews();
        var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        if (!reviewId || typeof reviewId != 'string' || reviewId.match(/^[ ]*$/) || !ObjectIdExp.test(reviewId)) {
            throw `reviewId in /data/reviews.js/updateVoteUp has error`
        }
        if (!voterId || typeof voterId != 'string' || voterId.match(/^[ ]*$/) || !ObjectIdExp.test(voterId)) {
            throw `voterId in /data/reviews.js/updateVoteUp has error`
        }
        const review = await this.getReviewById(reviewId)
        if (review == null) {
            throw `didn't find review by id : ${reviewId}`
        }
        const voter = await usersMethods.getUserById(voterId)
        if (voter == null) {
            throw `didn't find user by id : ${voterId}`
        }
        try {
            let voterArr=review.voteUp
            if(voterArr.indexOf(voterId)==-1){
                voterArr.push(voterId)
                //update user
                const usrUpdate=await usersMethods.addVotedForReview(voterId,reviewId)
                // if(usrUpdate==null){
                //     throw `user updated failed in reviews.js/removeReview`
                // }
            }else{
                voterArr.splice(voterArr.indexOf(voterId),1)
                const usrUpdate=await usersMethods.removeVotedForReview(voterId,reviewId)
                // if(usrUpdate==null){
                //     throw `user updated failed in reviews.js/removeReview`
                // }
            }
            await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $set: {'voteUp':voterArr} });
            const newData = await this.getReviewById(reviewId)
            return newData
        } catch (error) {
            throw error
        }
    },

    /**
     * 
     * @param {*} reviewId 
     * @param {*} voterId 
     * change the voteDown status
     */
    async updateVoteDown(reviewId, voterId) { 
        const reviewsCollection = await reviews();
        var ObjectIdExp = /^[0-9a-fA-F]{24}$/
        if (!reviewId || typeof reviewId != 'string' || reviewId.match(/^[ ]*$/) || !ObjectIdExp.test(reviewId)) {
            throw `reviewId in /data/reviews.js/updateVoteDown has error`
        }
        if (!voterId || typeof voterId != 'string' || voterId.match(/^[ ]*$/) || !ObjectIdExp.test(voterId)) {
            throw `voterId in /data/reviews.js/updateVoteDown has error`
        }
        const review = await this.getReviewById(reviewId)
        if (review == null) {
            throw `didn't find review by id : ${reviewId}`
        }
        const voter = await usersMethods.getUserById(voterId)
        console.log(voter);
        if (voter == null) {
            throw `didn't find user by id : ${voterId}`
        }
        try {
            let voterArr=review.voteDown
            if(voterArr.indexOf(voterId)==-1){
                voterArr.push(voterId)
                const usrUpdate=await usersMethods.addVotedForReview(voterId,reviewId)
            }else{
                voterArr.splice(voterArr.indexOf(voterId),1)
                const usrUpdate=await usersMethods.removeVotedForReview(voterId,reviewId)
            }
            await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $set: {voteDown:voterArr} });
            const newData = await this.getReviewById(reviewId)
            return newData
        } catch (error) {
            throw error
        }
    }
};

module.exports = exportedMethods;
