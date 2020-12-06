const mongoCollections = require('../config/mongoCollections');
const answers = mongoCollections.anwsers;

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
        
    },
    async removeAnswer(id) {
        //also remove comments related to the Answer. 
    },
    
    async updateAnswer(id, content) {},

    async addReview(id, reviewId){},
    async removeReview(id, reviewId){},

    async addVoteUp(id, voterId){},
    async removeVoteUp(id, voterId){},

    async addVoteDown(id, voterId){},
    async removeVoteDown(id, voterId){}
};

module.exports = exportedMethods;