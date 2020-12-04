/*
Generate data to database for test.
Just for test, all data in this file are hardcoded, 
but in each module we need to use the functions in data file(../data/) to operate the database.
author: Wu Haodong
date: 2020-11-13 11:44:27

updated 1:
change the format of the arrays of id to string
date: 
*/
const dbConnection = require('../config/mongoConnection');
const mongoCollections = require('../config/mongoCollections');
const data = require('../data');
// const users = data.users;
// const questions = data.questions;
// const answers = data.anwsers;
// const reviews = data.reviews;
// const systemConfigs = data.systemConfigs;
const usersData = mongoCollections.users;
const questionsData = mongoCollections.questions;
const answersData = mongoCollections.anwsers;
const reviewsData = mongoCollections.reviews;
const systemConfigsData = mongoCollections.systemConfigs;

const main = async () => {
    const usersCollection = await usersData();
    const questionsCollection = await questionsData();
    const answersCollection = await answersData();
    const reviewsCollection = await reviewsData();
    const systemConfigsCollection = await systemConfigsData();
    const db = await dbConnection();
    //delete the whole database.
    await db.dropDatabase();

    //create a new user
    const newUser = {
        userName: "abcd123",
        email:"abcd123@gmail.com" ,
        password:"safaDsfqe@caq42!" ,
        dateSignedIn: new Date(),
        questions: [],
        answers: [],
        reviews: [],
        votedForReview:[],
        votedForAnswers: []
      };
  
    const insertNewUserInfo = await usersCollection.insertOne(newUser);
    if (insertNewUserInfo.insertedCount === 0) throw `Error: could not add user.`;
    const newUserId = insertNewUserInfo.insertedId;

    //create a new answerer
    const newAnswerMan = {
        userName: "tool_answer_man",
        email:"tool_answer_man@gmail.com" ,
        password:"safaDsfqe@caq42!" ,
        dateSignedIn: new Date(),
        questions: [],
        answers: [],
        reviews: [],
        votedForReview:[],
        votedForAnswers: []
      };
  
    const insertNewAnswerManInfo = await usersCollection.insertOne(newAnswerMan);
    if (insertNewAnswerManInfo.insertedCount === 0) throw `Error: could not add the answer man.`;
    const newAnswerManId = insertNewAnswerManInfo.insertedId;

    
    //create a new question
    const newQuestion = {
        content:"Why this is a question?",
        topic: ["Programming languages", "FootBall"],
        questioner: newUserId.toString(),
        questionCreatedTime:  new Date(),
        answers: []
        }
    const insertNewQuestionInfo = await questionsCollection.insertOne(newQuestion);
    if (insertNewQuestionInfo.insertedCount === 0) throw `Error: could not add question.`;
    const newQuestionId = insertNewQuestionInfo.insertedId;
    //add the question to the user
    await usersCollection.updateOne(
        { _id: newUserId },
        { $addToSet: { 
            questions: newQuestionId.toString(),
         } }
      );

    //create a new answer
    const newAnswer = {
        content:"Because this is a answer.",
        recentUpdatedTime:  new Date(),
        answerer: newAnswerManId.toString(),
        questionId: newQuestionId.toString(),
        reviews:[] ,
        voteUp: [] ,
        voteDown: [],
        }
    const insertNewAnswerInfo = await answersCollection.insertOne(newAnswer);
    if (insertNewAnswerInfo.insertedCount === 0) throw `Error: could not add Answer.`;
    const newAnswerId = insertNewAnswerInfo.insertedId;
    //add the Answer to the question
    await questionsCollection.updateOne(
        { _id: newQuestionId },
        { $addToSet: { 
            answers: newAnswerId.toString(),
         } }
      );
    //add the Answer to the answerMan
    await usersCollection.updateOne(
        { _id: newAnswerManId },
        { $addToSet: { 
            answers: newAnswerId.toString(),
         } }
      );
    //add a voteup to the answer
    await answersCollection.updateOne(
        { _id: newAnswerId },
        { $addToSet: { 
            voteUp: newAnswerManId.toString(),
            voteDown: newUserId.toString(),
         } }
      );
    //add a vote to the voter
    await usersCollection.updateOne(
        { _id: newAnswerManId },
        { $addToSet: { 
            votedForAnswers: newAnswerId.toString(),
         } }
      );

    
    //create a new review
    const newReview = {
        content:"This is a review",
        recentUpdatedTime:  new Date(),
        Reviewer: newUserId.toString(),
        answerId: newAnswerId.toString(),
        voteUp: [] ,
        voteDown: [],
        }
    const insertNewReviewInfo = await reviewsCollection.insertOne(newReview);
    if (insertNewReviewInfo.insertedCount === 0) throw `Error: could not add Review.`;
    const newReviewId = insertNewReviewInfo.insertedId;
    //add the review to the answer
    await answersCollection.updateOne(
        { _id: newAnswerId },
        { $addToSet: { 
            reviews: newReviewId.toString(),
            } }
        );
    //add the review to the reviewer
    await usersCollection.updateOne(
        { _id: newUserId },
        { $addToSet: { 
            reviews: newReviewId.toString(),
            } }
        );
    //add a voteup to the review
    await reviewsCollection.updateOne(
        { _id: newReviewId },
        { $addToSet: { 
            voteUp: newAnswerManId.toString(),
            voteDown: newUserId.toString(),
            } }
        );
    //add a vote to the voter
    await usersCollection.updateOne(
        { _id: newAnswerManId },
        { $addToSet: { 
            votedForReview: newReviewId.toString(),
            } }
        );
    console.log('Done seeding database');

    await db.serverConfig.close();
};

main().catch(console.log);

module.exports = main;