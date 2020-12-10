const userUtils = require("./users");
const answerUtils = require("./answers");
const questionUtils = require("./questions");
const init = async ()=>{
    await testAddUser();
    await testAddQuestion();
}

const testAddUser = async() =>{
    try{
        userUtils.addUser("test@gmail.com", "123456", "Test", "hoboken", "NJ");
        userUtils.addUser("partrick@gmail.com", "123456", "Patrick", "hoboken", "NJ");
    }catch(err){
        console.log(err);
    }
};

const testAddQuestion = async() => {
    try{
        const question = await questionUtils.addQuestion("Is this a question exapmle?", "This is an exmpale of topic.", "Test");
    }catch(err){
        console.log(err);
    }
}
/*
  {
    _id: '5fd17196e0bb221f20f1f5a3',
    content: 'Is this a question exapmle?',
    topic: 'This is an exmpale of topic.',
    questioner: 'Test',
    questionCreatedTime: 2020-12-10T00:53:42.740Z,
    answers: []
  }
  _id和ObjectId
*/
const testAddAnswer = async() =>{
    try{
        let questionList = await questionUtils.getAllQuestions();
        console.log(questionList);
        const addedAsnwer = await answerUtils.addAnswer("Example answer", "Patrick", questionList[0]._id);
    }catch(err){
        console.log(err);
    }
}
// init();

testAddAnswer();



