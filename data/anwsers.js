const mongoCollections = require('../config/mongoCollections');
const anwsers = mongoCollections.anwsers;

let exportedMethods = {
    async getAllAnwsers() {},
    async getAnwserById(id) {},
    async addAnwser(content, answerer, questionId) {
        //check whether AnwserName duplicated
        //generate recentUpdatedTime
        //generate empty arryays for reviews voteUp voteDown
    },
    async removeAnwser(id) {
        //also remove comments related to the Anwser. 
    },
    
    async updateAnwser(id, content) {},

    async addReview(id, reviewId){},
    async removeReview(id, reviewId){},

    async addVoteUp(id, voterId){},
    async removeVoteUp(id, voterId){},

    async addVoteDown(id, voterId){},
    async removeVoteDown(id, voterId){}
};

module.exports = exportedMethods;