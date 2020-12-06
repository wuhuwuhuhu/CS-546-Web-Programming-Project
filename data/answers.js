const mongoCollections = require('../config/mongoCollections');
const anwsers = mongoCollections.anwsers;

let exportedMethods = {

    async getAllAnwsers() {
        const anwsersCollection = await anwsers();
        const anwsersList = await anwsersCollection.find({}).toArray();
        return anwsersList;
    },
    async getAnwserById(id) {
        if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/)) {
            throw `id of /data/reviews.js/getReviewById is not String or legal input`
        }
        const answersCollection = await answers();
        try {
            const answerById = await answersCollection.findOne({ _id: ObjectId(id) });
            return answerById;
        } catch (error) {
            throw `there is an error in /data/answers.js/getAnwserById`
        }
    },
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