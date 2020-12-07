const mongoCollections = require('../config/mongoCollections');
const { removeReview } = require('./answers');
const users = mongoCollections.users;
const ObjectId = require('mongodb').ObjectId;

let exportedMethods = {
    async getAllUsers() {},
    /**
     * get user by id
     * @param {*} id 
     */
    async getUserById(id) {
        if (!id || id == null || typeof id != 'string' || id.match(/^[ ]*$/)) {
            throw `id of /data/users.js/getUserById is not String or legal input`
        }
        const usersCollection = await users();
        try {
            const userById = await usersCollection.findOne({ _id: ObjectId(id) });
            return userById;
        } catch (error) {
            throw `there is an error in /data/users.js/getUserById`
        }
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

    async addReview(id,reviewId){},

    async removeReview(id,reviewId){},

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