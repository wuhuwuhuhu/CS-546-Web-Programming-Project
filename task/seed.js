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
 const users = data.users;
 const questions = data.questions;
 const answers = data.anwsers;
 const reviews = data.reviews;
 const systemConfigs = data.systemConfigs;
const usersData = mongoCollections.users;
const questionsData = mongoCollections.questions;
const answersData = mongoCollections.answers;
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

    //initial topics
    const topics =["Books","Music","Movies","Wine","Cooking","Travel","Other"]
    const insertInfo = await systemConfigsCollection.insertOne({topics:topics});
    if(insertInfo.insertedCount === 0 ) throw `Error: could not insert topics.`;
//
//    //create a new user
//    const newUser = {
//        userName: "abcd123",
//        email:"abcd123@gmail.com" ,
//        password:"safaDsfqe@caq42!" ,
//        dateSignedIn: new Date(),
//        questions: [],
//        answers: [],
//        reviews: [],
//        votedForReview:[],
//        votedForAnswers: []
//      };
//
//    const insertNewUserInfo = await usersCollection.insertOne(newUser);
//    if (insertNewUserInfo.insertedCount === 0) throw `Error: could not add user.`;
//    const newUserId = insertNewUserInfo.insertedId;
//
//    //create a new answerer
//    const newAnswerMan = {
//        userName: "tool_answer_man",
//        email:"tool_answer_man@gmail.com" ,
//        password:"safaDsfqe@caq42!" ,
//        dateSignedIn: new Date(),
//        questions: [],
//        answers: [],
//        reviews: [],
//        votedForReview:[],
//        votedForAnswers: []
//      };
//
//    const insertNewAnswerManInfo = await usersCollection.insertOne(newAnswerMan);
//    if (insertNewAnswerManInfo.insertedCount === 0) throw `Error: could not add the answer man.`;
//    const newAnswerManId = insertNewAnswerManInfo.insertedId;
//
//
//    //create a new question
//    const newQuestion = {
//        content:"Why this is a question?",
//        topic: ["Programming languages", "FootBall"],
//        questioner: newUserId.toString(),
//        questionCreatedTime:  new Date(),
//        answers: []
//        }
//    const insertNewQuestionInfo = await questionsCollection.insertOne(newQuestion);
//    if (insertNewQuestionInfo.insertedCount === 0) throw `Error: could not add question.`;
//    const newQuestionId = insertNewQuestionInfo.insertedId;
//    //add the question to the user
//    await usersCollection.updateOne(
//        { _id: newUserId },
//
//        { $addToSet: { 
//            questions: newQuestionId.toString(),
//         } }
//      );
//
//    //create a new answer
//    const newAnswer = {
//        content:"Because this is a answer.",
//        recentUpdatedTime:  new Date(),
//        answerer: newAnswerManId.toString(),
//        questionId: newQuestionId.toString(),
//        reviews:[] ,
//        voteUp: [] ,
//        voteDown: [],
//        }
//    const insertNewAnswerInfo = await answersCollection.insertOne(newAnswer);
//    if (insertNewAnswerInfo.insertedCount === 0) throw `Error: could not add Answer.`;
//    const newAnswerId = insertNewAnswerInfo.insertedId;
//    //add the Answer to the question
//    await questionsCollection.updateOne(
//        { _id: newQuestionId },
//
//        { $addToSet: { 
//            answers: newAnswerId.toString(),
//
//         } }
//      );
//    //add the Answer to the answerMan
//    await usersCollection.updateOne(
//        { _id: newAnswerManId },
//        { $addToSet: { 
//            answers: newAnswerId.toString(),
//         } }
//      );
//    //add a voteup to the answer
//    await answersCollection.updateOne(
//        { _id: newAnswerId },
//        { $addToSet: { 
//            voteUp: newAnswerManId.toString(),
//            voteDown: newUserId.toString(),
//         } }
//      );
//    //add a vote to the voter
//    await usersCollection.updateOne(
//        { _id: newAnswerManId },
//        { $addToSet: { 
//            votedForAnswers: newAnswerId.toString(),
//         } }
//      );
//
//    
//    //create a new review
//    const newReview = {
//        content:"This is a review",
//        recentUpdatedTime:  new Date(),
//        Reviewer: newUserId.toString(),
//        answerId: newAnswerId.toString(),
//        voteUp: [] ,
//        voteDown: [],
//        }
//    const insertNewReviewInfo = await reviewsCollection.insertOne(newReview);
//    if (insertNewReviewInfo.insertedCount === 0) throw `Error: could not add Review.`;
//    const newReviewId = insertNewReviewInfo.insertedId;
//    //add the review to the answer
//    await answersCollection.updateOne(
//        { _id: newAnswerId },
//        { $addToSet: { 
//            reviews: newReviewId.toString(),
//            } }
//        );
//    //add the review to the reviewer
//    await usersCollection.updateOne(
//        { _id: newUserId },
//        { $addToSet: { 
//            reviews: newReviewId.toString(),
//            } }
//        );
//    //add a voteup to the review
//    await reviewsCollection.updateOne(
//        { _id: newReviewId },
//        { $addToSet: { 
//            voteUp: newAnswerManId.toString(),
//            voteDown: newUserId.toString(),
//            } }
//        );
//    //add a vote to the voter
//    await usersCollection.updateOne(
//        { _id: newAnswerManId },
//        { $addToSet: { 
//            votedForReview: newReviewId.toString(),
//            } }
//		);
//		

	//length 24
	const userNameList = ["abyKristyButterfly","angel","bubbles","shimmer","glimmer","doll","JayChou","VenomFate","Frozen","DarkSide",
	"hateJava","hateCPP","UltimateBeast","RockieMountain","MusicViking","SloppyJoe","Marry2020","Avatar2022","McDon2020","SupperBug2020"]

	const emailList =["qrym.rayax@taikz.com","yholako.vip9@brackettmail.com","linsaf10insafe@eshtaholdings.com","6medo.shagareen2@emphasysav.com","khassnha@chanmelon.com",
	"4akra@wikirefs.com","wtarekmasaoo@fogmart.com","zelegant.youn@garagedoorselmirage.com","nlkalbef@vermontamazon.com","ishala@malomiesed.com",
	"0jorgearman@factorypeople.com","4owtrageous.pe@esbuah.nl","graysalinax@aloftventure.com","phamza_evan@encodium.com","pmido_mahmoud5217@lttmobile.com",
	"0sweet.ismarica4@kittiza.com","izahra@chatur21bate.com","0meyree.int@aristockphoto.com","ipras@atourfinest.com","ymoham@texasaol.com"]

	const passwordList = ["qRy27pEux#_*L7","jPpG>oe2BFH74(%","eo7x701)aFJz1H;1","iwE[p+i}1.3Wq,9)","cX8zOu:A:ZqFK:Hk","NV>]D>O)24ay_MM{","d3=PX#X$8y'DORS","v6{k{&~IA5$Rkl8-","gu>HT]53rk{E}V7t",
	"J|JCtR;uw9??pnd3","TYj!i%ode&hKg@49","u9bwsJ8X0JpU|I;E","dw*PAX7Yl)Owl>bW","Rx]%4KF>=j~)x/X_","x04*xMsK@a!&m(L","-TDWH4C!%ayhXft%",
	"#8yaB!Pw4B8H6nPL","=qj8f&k@rLb#fKEH","5w_EY__*2kkq#ub*","B%p88Ps_6A+qLU#s"]
//
//
//	console.log(userNameList.length)
//	console.log(emailList.length)
//	console.log(passwordList.length)
//helper function to generate random time between given range
	function randomTime(startTime, endTime) {
		let start = new Date(startTime);
		let end = new Date(endTime);
		let diff =  end.getTime() - start.getTime();
		let new_diff = diff * Math.random();
		let date = new Date(start.getTime() + new_diff);
		return date;
	}
	// create 20 users
	const userIdList = []
	try {
		for(let i = 0; i< userNameList.length; i++){
			let newTime = randomTime('July 20, 2000 00:20:18 GMT+00:00','December 02, 2018 00:20:18 GMT+00:00');
			//console.log(newTime);
			
			const newUser = {
				userName: userNameList[i],
				email:emailList[i] ,
				password:passwordList[i] ,
				dateSignedIn: newTime,
				questions: [],
				answers: [],
				reviews: [],
				votedForReview:[],
				votedForAnswers: []
			  };

			const insertInfo = await usersCollection.insertOne(newUser)
			if (insertInfo.insertedCount === 0) throw `Error: could not add new user.`;
			const newUserId = insertInfo.insertedId.toString();
			userIdList.push(newUserId)
		}
	//	console.log(userIdList)
	} catch (error) {
		console.log(error)
	}

	//create questions for users
	//    //create a new question
//    const newQuestion = {
//        content:"Why this is a question?",
//        topic: ["Programming languages", "FootBall"],
//        questioner: newUserId.toString(),
//        questionCreatedTime:  new Date(),
//        answers: []
//        }
	let bookQuestionList =["What is the best non-fiction book of 2020?","Any Horror novelist better than Steven King?","Is Pulizer the highest honor for novels?","What is the best book you've read in 2020?","How to read books fast?","Where to buy second-hand Computer Science books?",
	"Is there a book that change your life？","When is your favourite time to read?","Everything on web now, do we still need paper-version book any more?" ]
	let musicQuestionList =["Why jazz music makes me feel relaxed?","What do you listen when driving?",
	"Which prime musci station do you recommand for listening during coding?","Why classical music not popular anymore?",
	"Which singer is your favourite?","Why people say 'The Beatles' creates a history?","What music is most popular restaurant music?"]
	let movieQuestionList =["Best Si-Fi movie you think?","Best romantic movie in your opinion?",
	"What is the highest rated movie you think?","When will 'Avatar2' be revealed?","Why it takes more than 10 years to produce Avatar2?",
"Movies that you didn't figured out after watching it?", "What movie to watch in the first date?"]
	let wineQuestionList =["Is California the biggest wine producing location?","Why people in code area drink more than other area?",
	"Why young people choose beer over wine?","Is white wine really anti-aging?"]
	let cookQuestionList =["Cooking 2 hours, eating 10 minutes, worth it?", "How to master French cooking?",
	"What is best cooking recipies website?",
	"Why cooking videos are popular in YouTube?","Why Chinese takout so popular in NY?","Is boroccoli the healthest vegi?"]
	let travelQuestionList =["Why people like travel?","What is the meaning of traveling?","5 star hotel or knapsack travel, what do you get from different ways of travel?"]
	let otherQuestionList =["What do you do when you're bored?","Is there any people really viewing this website?","Where are you going? Where Have You Been?"]
	console.log(bookQuestionList.length)
	console.log(musicQuestionList.length)
	console.log(movieQuestionList.length)
	console.log(wineQuestionList.length)
	console.log(wineQuestionList.length)
	console.log(cookQuestionList.length)
	console.log(travelQuestionList.length)
	console.log(otherQuestionList.length)
	let questionIdList = []
		//create questions
	let questionList = [bookQuestionList,musicQuestionList,movieQuestionList,wineQuestionList,cookQuestionList,travelQuestionList,otherQuestionList]
	try {
		let seeds = true;
		let j=0;
		while(seeds){		
			for(let i = 0; i < questionIdList.length; i++){ues
				if(questionList[i].length !== 0){
					const newQuestion = await questions.addQuestion(questionList[i][0],topics[i],userIdList[j]);
					questionIdList.push(newQuestion._id)		
					questionList[i].splice(0,1);
				}
					
			}
			j=(j+1) % 20;
			if(bookQuestionList.length + musicQuestionList.length + movieQuestionList.length + wineQuestionList.length + cookQuestionList.length + travelQuestionList.length + otherQuestionList.length ===0){
				seeds = false;
			}
		}
		console.log(questionIdList)
	} catch (error) {
		console.log(error);
		
	}
	//add answers
	try {
		//async addAnswer(content, answerer, questionId)
		const questionList = await questions.getAllQuestions();
	} catch (error) {
		
	}

	
    console.log('Done seeding database');

    await db.serverConfig.close();
};

main().catch(console.log);

module.exports = main;