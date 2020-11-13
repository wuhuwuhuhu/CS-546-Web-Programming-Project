const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let exportedMethods = {
    async getAllUsers() {},
    async getUserById(id) {
        const usersCollection = await users();
        if(typeof id === "string")
        {
            let { ObjectId } = require("mongodb");
            id = ObjectId(id);
        }
        const userfinded = await usersCollection.findOne({ _id: id });
        if (userfinded === null) throw `Error: No user with that id ${id}`;
        return userfinded;
    },
    async getUserByUserName(userName) {
    },
    async addUser(userName, email, password) {
        //check whether userName duplicated
        //generate _id, hash password, generate dateSignedIn 
        //generate empty arryays for questions answers reviews votedForReviews votedForAnswers
    },
    async removeUser(id) {
        //also remove all data related to the user. 
    },
    async updateUser(id, email, password) {},

    async addQuestion(id,questionId){
        //the questionId is the question that the user aksed
    },
    async removeQuestion(id,questionId){},

    async addAnswer(id,answerId){
        //the answerId is the answer that the user answered
    },
    async removeAnswer(id,answerId){},

    async addVotedForReview(id,ReviewId){
        //just add the ReviewId to the votedForReviews
    },
    async removeVotedForReview(id,ReviewId){},

    async addVotedForAnswer(id,AnswerId){},
    async removeVotedForAnswer(id,AnswerId){}
};

module.exports = exportedMethods;