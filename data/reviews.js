const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const anwsersdMethods = require("./anwsers");
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
            throw 'id of /data/reviews.js/getReviewById is not String or legal input ';
        }
        const reviewsCollection = await reviews();
        try {
            const reviewById = await reviewsCollection.findOne({ _id: ObjectId(id) });
            return reviewById;
        } catch (error) {
            console.log("there is an error in /data/questions.js/getReviewById");
            return null
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
            console.log("content in /data/reviews.js/addReview is blank");
            return null
        }
        if (!reviewer || reviewer == null || typeof reviewer != 'string' || reviewer.match(/^[ ]*$/)) {
            console.log("reviewer in /data/reviews.js/addReview is blank");
            return null
        }
        if (!answerId || answerId == null || typeof answerId != 'string' || answerId.match(/^[ ]*$/) || !ObjectIdExp.test(answerId)) {
            console.log("answerId in /data/reviews.js/addReview has error");
            return null
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
            const ansAndRev=  await anwsersdMethods.addReview(answerId,newId);
            if(ansAndRev==null){
                throw 'Insert failed!';
            }
            const review = await this.getReviewById(newId.toString());
            console.log(review);
            return review
        } catch (error) {
            return null
        }
    },
    async removeReview(id) {
        //also remove comments related to the Review. 
    },

    async updateReview(id, content) { },

    async addVoteUp(id, voterId) { },
    async removeVoteUp(id, voterId) { },

    async addVoteDown(id, voterId) { },
    async removeVoteDown(id, voterId) { }
};

module.exports = exportedMethods;
