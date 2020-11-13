const mongoCollections = require('../config/mongoCollections');
const answers = mongoCollections.anwsers;

let exportedMethods = {
    async getAllAnwsers() {},
    async getAnwserById(id) {
        const answersCollection = await answers();
        if(typeof id === "string")
        {
            let { ObjectId } = require("mongodb");
            id = ObjectId(id);
        }
        const answerfinded = await answersCollection.findOne({ _id: id });
        if (answerfinded === null) throw `Error: No answer with that id ${id}`;
        return answerfinded;
    },
    async addAnwser(content, answerer, questionId) {
        //check whether AnwserName duplicated
        //generate recentUpdatedTime
        //generate empty arryays for answers voteUp voteDown
    },
    async removeAnwser(id) {
        //also remove comments related to the Anwser. 
    },
    
    async updateAnwser(id, content) {},

    async addanswer(id, answerId){},
    async removeanswer(id, answerId){},

    async addVoteUp(id, voterId){},
    async removeVoteUp(id, voterId){},

    async addVoteDown(id, voterId){},
    async removeVoteDown(id, voterId){}
};

module.exports = exportedMethods;