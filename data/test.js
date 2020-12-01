const questionData = require('./questions')

async function main() {
	try {
		const questionList = await questionData.getAllQuestions()
		console.log(questionList)
	} catch (error) {
		console.log(error)
	}

	try {
		const q = await questionData.getQuestionById("5fc6a0571a5c980a845c8752") // add id here
		console.log(q)
	} catch (error) {
		console.log(error)
	}

	try {
		const newQ = await questionData.addQuestion("How to learn java in 3 days?", "Programming Languages", "Baby Programmer")
		const qList = await questionData.getAllQuestions()
		console.log(qList)
	} catch (error) {
		console.log(error)
	}


	try {
		const addA = await questionData.addAnswer("5fc6a0571a5c980a845c8752", "5fc6999f1b83db0f9c7fae9g") // add id here
		// check database
	} catch (error) {
		console.log(error)

	}

	try {
		const removeA = await questionData.removeAnswer("5fc6a0571a5c980a845c8752", "5fc6999f1b83db0f9c7fae9g") ;// add ids here
		// check user, questions,answer, reviews
	} catch (error) {
		console.log(error)
	}

	try {
		const removeQ = await questionData.removeQuestion("5fc6a0571a5c980a845c8752") // add id here
		const qList = await questionData.getAllQuestions()
		console.log(qList)

	} catch (error) {
		console.log(error)
	}

}

main()
