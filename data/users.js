    const mongoCollections = require('../config/mongoCollections');
    const users = mongoCollections.users;
    const { ObjectId } = require('mongodb');
const data = require('.');

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
            let x = ObjectId(id);
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
        async addUser(email, hashedPassword, userName) {
            console.log("-------addd")
            if (!email) throw new Error('You must provide an email');
            if (!hashedPassword) throw new Error('You must provide a hashed password');
            if (!userName) throw new Error('You must provide a userNme');
            // if (!city) throw new Error('You must provide a city');
            // if (!state) throw new Error('You must provide a state');
            if (typeof email !== 'string') throw new TypeError('email must be a string');
            if (typeof hashedPassword !== 'string') throw new TypeError('hashedPassword must be a string');
            if (typeof userName !== 'string') throw new TypeError('userName must be a string');
            // if (typeof city !== 'string') throw new TypeError('city must be a string');
            // if (typeof state !== 'string') throw new TypeError('state must be a string');

            email = email.toLowerCase()
            // /需要在router写/
            // let emailExists = false;
            // try {
            //     const user = await this.getUserByEmail(email);
            //     if(user != null)
            //         emailExists = true;
            // } catch (err) {
            //     emailExists = false;
            // }

            // if (emailExists) throw new Error('500: Email already registered');

            let newUser = {
               // _id: uuid.v4(),
                email: email,
                hashedPassword: hashedPassword,
                userName: userName,
                questionId: [],
                data:new Date,
                ReviewId: [],
                AnswerId: [],
                VotedForReviews:[],
                VotedForAnswers:[],

            };

            const userCollection = await users();
            
          
            // userCollection.save(function(err){
            //     if(!err){
            //         console.log("save success")
            //     }
            // })
            const newInsertInformation = await userCollection.insertOne(newUser);
            console.log("--------"+newInsertInformation)
            // if (newInsertInformation.insertedCount === 0) throw new Error('Insert failed!');
            // console.log("--------"+newInsertInformation)
            console.log(newInsertInformation.ops[0])
            return await this.getUserById(JSON.stringify(newInsertInformation.ops[0]._id) );
        },

        async removeUser(id) {
            if (!id) throw new Error('You must provide an id');
            if (typeof id !== 'string') throw new TypeError('id must be a string');

            const userCollection = await users();
            const deletionInfo = await userCollection.removeOne({ _id: ObjectId(id) });

            if (deletionInfo.deletedCount === 0) {
                throw new Error(`Could not delete user with id of ${id}`);
            }

            return true;
        },
        async addQuestion(userId,QuestionId){
            if (!userId) throw new Error('You must provide a userId');
            if (!answerId) throw new Error('You must provide a QuestionId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $addToSet: { QuestionId: QuestionId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
            return await this.getUserById(userId);
        },
        async removeQuestion(userId,questionId){
            if (!userId) throw new Error('You must provide a userId');
            if (!answerId) throw new Error('You must provide a questionId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { questionId: questionId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        
            return await this.getUserById(userId);
        },
        
        async removeReview(userId,reviewId){
            if (!userId) throw new Error('You must provide a userId');
            if (!answerId) throw new Error('You must provide a reviewId')
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
            if (!answerId) throw new Error('You must provide a reviewId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $addToSet: { reviewId: reviewId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
            return await this.getUserById(userId);
        },
        //更新user数据库里的answer
        async addAnswer(id,answerId){//通常这里需要传入string
		//the answerId is the answer that the user answered
            if(!id || !answerId) throw 'users.js|addReview: you need to input id and answerId'
            if(typeof id !== 'string' || id.trim()==='') throw 'users.js|addReview: id must be non-empty string' 
            if(typeof answerId !== 'string' || answerId.trim()==='') throw 'users.js|addReview: answerId must be non-empty string'
            
            let objectId = await myDBfunction(id)
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne({ _id: objectId }, { $addToSet: { answers: answerId.trim() } })
            
            if (updateInfo.matchedCount === 0) throw `questions.js|updateQeustion(): answer ${id} not found`
            if (updateInfo.modifiedCount === 0) throw `questions.js|updateQeustion(): Nothing been updated.`
            
            let updatedUser = await this.getUserById(id);
            return updatedUser
        },
        async removeAnswer(userId,answerId){
            if (!userId) throw new Error('You must provide a userId');
            if (!answerId) throw new Error('You must provide a answerId')
            const userCollection = await users();
            const updateInfo = await userCollection.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { answerId: answerId } }
            );
            if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        
            return await this.getUserById(userId);
        }

    }
    

    module.exports = exportedMethods;
