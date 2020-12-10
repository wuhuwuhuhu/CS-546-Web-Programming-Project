    const mongoCollections = require('../config/mongoCollections');
    const users = mongoCollections.users;
    const { ObjectId } = require('mongodb');
    const uuid = require("uuid");


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
            if (!id) throw new Error('You must provide an id');
            if (typeof id !== 'string') throw new TypeError('id must be a string');
            
            const usersCollection = await users();
            try {
                const user = await usersCollection.findOne({ _id: ObjectId(id) });
                return user;
            } catch (error) {
                throw `there is an error in /data/users.js/getUser`
            }
        },
        //没有用name
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
        //userName不能重复
        async addUser(email, hashedPassword, userName, city, state) {
            if (!email) throw new Error('You must provide an email');
            if (!hashedPassword) throw new Error('You must provide a hashed password');
            if (!userName) throw new Error('You must provide a userNme');
            if (!city) throw new Error('You must provide a city');
            if (!state) throw new Error('You must provide a state');
            if (typeof email !== 'string') throw new TypeError('email must be a string');
            if (typeof hashedPassword !== 'string') throw new TypeError('hashedPassword must be a string');
            if (typeof userName !== 'string') throw new TypeError('userName must be a string');
            if (typeof city !== 'string') throw new TypeError('city must be a string');
            if (typeof state !== 'string') throw new TypeError('state must be a string');

            email = email.toLowerCase()

            let emailExists = false;
            try {
                const user = await this.getUserByEmail(email);
                if(user != null)
                    emailExists = true;
            } catch (err) {
                emailExists = false;
            }

            if (emailExists) throw new Error('500: Email already registered');

            let newUser = {
                _id: uuid.v4(),
                email: email,
                hashedPassword: hashedPassword,
                userName: userName,
                city: city,
                state: state,
                questionId: [],
                ReviewId: [],
                AnswerId: []
            };

            const userCollection = await users();
            const newInsertInformation = await userCollection.insertOne(newUser);

            if (newInsertInformation.insertedCount === 0) throw new Error('500: Insert failed!');

            return await this.getUserById(newInsertInformation.insertedId);
        },

        async removeUser(id) {
            if (!id) throw new Error('You must provide an id');
            if (typeof id !== 'string') throw new TypeError('id must be a string');

            const userCollection = await users();
            const deletionInfo = await userCollection.removeOne({ _id: ObjectId(id) });

            if (deletionInfo.deletedCount === 0) {
                throw new Error(`500: Could not delete user with id of ${id}`);
            }

            return true;
        },
        async removeReview(userId,reviewId){
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { reviewId: reviewId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        
            return await this.getUserById(userId);
        },

        async addReview(userId,reviewId){
            if (!userId) throw new Error('You must provide a userId');
            if (!reviewId) throw new Error('You must provide a reviewId');
            const user= await this.getUserById(userId);
            let ReviewId = user.ReviewId;
            ReviewId.push(reviewId);
        },
        //更新user数据库里的answer
        async addAnswer(userId,answerId){
            console.log("in add answer in user");
            if (!userId) throw new Error('You must provide a userId');
            if (!answerId) throw new Error('You must provide a answerId');
            const user= await this.getUserById(userId);
            let ReviewId = user.ReviewId;
            ReviewId.push(answerId);
            //the answerId is the answer that the user answered
        },
        async removeAnswer(userId,answerId){
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { reviewId: reviewId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        
            return await this.getUserById(userId);
        }
    }
    

    module.exports = exportedMethods;
