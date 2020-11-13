const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;

let exportedMethods = {
    async getAllReviews() {},
    async getReviewById(id) {},
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