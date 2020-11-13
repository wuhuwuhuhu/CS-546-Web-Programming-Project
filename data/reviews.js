const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;

let exportedMethods = {
    async getAllReviews() {},
    async getReviewById(id) {
        const reviewsCollection = await reviews();
        if(typeof id === "string")
        {
            let { ObjectId } = require("mongodb");
            id = ObjectId(id);
        }
        const reviewfinded = await reviewsCollection.findOne({ _id: id });
        if (reviewfinded === null) throw `Error: No review with that id ${id}`;
        return reviewfinded;
    },
    async addReview(content, answerer, questionId) {
        //check whether ReviewName duplicated
        //generate recentUpdatedTime
        //generate empty arryays for reviews voteUp voteDown
    },
    async removeReview(id) {
        //also remove comments related to the Review. 
    },
    
    async updateReview(id, content) {},

    async addVoteUp(id, voterId){},
    async removeVoteUp(id, voterId){},

    async addVoteDown(id, voterId){},
    async removeVoteDown(id, voterId){}
};

module.exports = exportedMethods;