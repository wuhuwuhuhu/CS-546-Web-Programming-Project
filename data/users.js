    const mongoCollections = require('../config/mongoCollections');
    const users = mongoCollections.users;
    const { ObjectId } = require('mongodb');
    const bcryptjs = require("bcryptjs")

    let exportedMethods = {
        async getAllUsers() {
            const userCollection = await users();
            const userList = await userCollection.find({}).toArray();
            if (!userList) throw new Error('404: Users not found');
            return userList;
        },
        /**
         * get user by id
         * @param {*} id 
         */
        async getUserByEmail(email) {
            if (!email) throw new Error('You must provide an email');
            if (typeof email !== 'string') 
                throw new TypeError('email must be a string');

            email = email.toLowerCase();
            const userCollection = await users();
            try{
                const userByEmail = await userCollection.findOne({ email: email });
                return userByEmail;
            }catch(error){
                throw `there is an error in /data/users.js/getUserByEmail `
            }
        },
        

        async getUserById(id) {
            // const objId = ObjectId.createFromHexString(id);;
            if (!id) throw new Error('You must provide an id');
            if(typeof id === 'string')
                id = ObjectId(id);
            // if (typeof id !== 'string') throw new TypeError('id must be a string');
            
            const usersCollection = await users();
            try {
                const user = await usersCollection.findOne({ _id: id });
                return user;
            } catch (error) {
                throw `there is an error in /data/users.js/getUser`
            }
        },
        //name is not used
        async getUserByName(name) {
            if (!name) throw new Error('You must provide an name');
            if (typeof name !== 'string') throw new TypeError('name must be a string');

            name = name.toLowerCase();

            const userCollection = await users();
            try{
            const userByEmail = await userCollection.findOne({ name: name });
            return userByEmail;
            }catch(error){
                throw `there is an error in /data/users.js/getUserByEmail `
            }


            
        },
        //userName cant be same 
        async addUser(email, hashedPassword, userName) {
           
            console.log("-------addd")
            if (!email) throw new Error('You must provide an email');
            if (!hashedPassword) throw new Error('You must provide a password');
            if (!userName) throw new Error('You must provide a userName');
            if (typeof email !== 'string') throw new TypeError('email must be a string');
            if (typeof hashedPassword !== 'string') throw new TypeError('hashedPassword must be a string');
            if (typeof userName !== 'string') throw new TypeError('userName must be a string');
            email = email.toLowerCase()
            let emailExists = false;
            try {
                const user = await this.getUserByEmail(email);
                if(user != null)
                    emailExists = true;
            } catch (err) {
                emailExists = false;
            }

            if (emailExists) throw new Error('Email already registered');
            const salt = bcryptjs.genSaltSync(16);
            const hash = bcryptjs.hashSync(hashedPassword, salt);
            let newUser = {
               // _id: uuid.v4(),
                email: email,
                hashedPassword: hash,
                userName: userName,
                questions: [],
                data:new Date,
                reviews: [],
                answers: [],
                votedForReviews:[],
                votedForAnswers:[],
            };
            const userCollection = await users();
            const newInsertInformation = await userCollection.insertOne(newUser);
            return await this.getUserById((newInsertInformation.insertedId) );
        },

        // async removeUser(id) {
        //     if (!id) throw new Error('You must provide an id');
        //     if (typeof id !== 'string') throw new TypeError('id must be a string');

        //     const userCollection = await users();
        //     const deletionInfo = await userCollection.removeOne({ _id: ObjectId(id) });
        
        //     if (deletionInfo.deletedCount === 0) {
        //         throw new Error(`Could not delete user with id of ${id}`);
        //     }

        //     return true;
        // },
        async addQuestion(userId,QuestionId){
            if (!userId) throw new Error('You must provide a userId');
            if (!QuestionId) throw new Error('You must provide a questionId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $addToSet: { questions: QuestionId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
            return await this.getUserById(userId);
        },
        async removeQuestion(userId,QuestionId){
            if (!userId) throw new Error('You must provide a userId');
            if (!QuestionId) throw new Error('You must provide a QuestionId')
            const userCollection = await users();
            // let user = await this.getUserById(userId);
            // // console.log(user);
            // for(let questionId of user.questions){
            //     // console.log(questionId);
            // }
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { questions: QuestionId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        
            return await this.getUserById(userId);
        },
        
        async removeReview(userId,reviewId){
            if (!userId) throw new Error('You must provide a userId');
            if (!reviewId) throw new Error('You must provide a reviewId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { reviews: reviewId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        
            return await this.getUserById(userId);
        },

        async addReview(userId,ReviewId){
            if (!userId) throw new Error('You must provide a userId');
            if (!ReviewId) throw new Error('You must provide a reviewId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $addToSet: { reviews: ReviewId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
            return await this.getUserById(userId);
        },
        //update user answer
            async addAnswer(userId,answerId){//string
		    //the answerId is the answer that the user answered
            if (!userId) throw new Error('You must provide a userId');
            if (!answerId) throw new Error('You must provide a answerId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $addToSet: { answers: answerId } }
        );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
            return await this.getUserById(userId);
        },
        async removeAnswer(userId,answerId){
            if (!userId) throw new Error('You must provide a userId');
            if (!answerId) throw new Error('You must provide a answerId')
            const userCollection = await users();
            
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { answers: answerId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        
            return await this.getUserById(userId);
        }

    }

    // removeUser(userId){
    //     1. remove user
    //     2. requireQuestion : remove(questionId)
    //     // user.deleteOne()
    //     const questionUtil = require("./questions");
    //     let user = this.getUserById(userId);
    //     questionList = user.questionList;
    //     for(let questionId in questionList){
    //         questionUtil.removeAnswer(questionId);
    //     }

    // }
    

   module.exports = exportedMethods;
    // //quetion removeAnswer
    // removeAnswer(questionId, answerId) 拿到question 删掉它里面的answerId就行
    // //answer removeAnswer
    // 首先删掉answer表里answer
    // 拿到questionId 调用question的removeAnswer()
    // 调用review的removeReviewById
    
