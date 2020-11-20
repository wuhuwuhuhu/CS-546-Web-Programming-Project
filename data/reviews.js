const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const usersMethods = require("./users");
const anwsersdMethods = require("./anwsers");
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
        if (!reviewer || reviewer == null || typeof reviewer != 'string' || reviewer.match(/^[ ]*$/)) {
            throw `reviewer in /data/reviews.js/addReview is blank`
        }
        if (!answerId || answerId == null || typeof answerId != 'string' || answerId.match(/^[ ]*$/) || !ObjectIdExp.test(answerId)) {
            throw `answerId in /data/reviews.js/addReview has error`
        }
        try {
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
            const newId = insertInfor.insertedId;
            const ansAndRev = await anwsersdMethods.addReview(answerId, newId);
            if (ansAndRev == null) {
                throw 'Insert failed!';
            }
            const review = await this.getReviewById(newId.toString());
            return review
        } catch (error) {
            throw error
        }
    },
    async removeReview(id) {
        //also remove comments related to the Review. 
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
            const newReview = {
                content: content,
                recentUpdatedTime: oldReview.recentUpdatedTime,
                Reviewer: oldReview.Reviewer,
                answerId: oldReview.answerId,
                voteUp: oldReview.voteUp,
                voteDown: oldReview.voteDown
            }
            try {
                await reviewsCollection.updateOne({ _id: ObjectId(id) }, { $set: newReview });
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
            console.log(voterArr.indexOf(ObjectId(voterId)));
            console.log(typeof voterArr[0]);
            if(voterArr.indexOf(ObjectId(voterId))==-1){
                voterArr.push(voterArr)
            }else{
                voterArr.splice(voterArr.indexOf(voterId),1)
            }
            console.log(voterArr);
            await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $set: {'voteUp':voterArr} });
            const newData = await this.getReviewById(reviewId)
            return newData
        } catch (error) {
            console.log("error");
            return null
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
        if (voter == null) {
            throw `didn't find user by id : ${voterId}`
        }
        try {
            let voterArr=review.voteDown
            if(voterArr.indexOf(voterId)==-1){
                voterArr.push(voterArr)
            }else{
                voterArr.splice(voterArr.indexOf(voterId),1)
            }
            await reviewsCollection.updateOne({ _id: ObjectId(reviewId) }, { $set: {voteDown:voterArr} });
            return true
        } catch (error) {
            return false
        }
    }
};

module.exports = exportedMethods;
