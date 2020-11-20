const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;



let exportedMethods = {
    async getAllUsers() {},
    async getUserById(id) {},
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
        //this part been done in data/questions.js
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
