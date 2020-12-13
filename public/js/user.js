(function ($) {
    const changePasswordDiv = $('#changePassword');
    const changePasswordFormSubmitButton = $('#changePasswordFormSubmitButton');
    const changePasswordFormStatus = $('#changePasswordFormStatus');
    const personalInfoChangePasswordButton = $('#personalInfoChangePasswordButton')
    //init
    

    //init questions
    const questionsDivList = $('#userQuestionsList');
    const questionsLimitSelect = $('#questionsLimitSelect');
    const questionsSortSelect = $('#questionsSortSelect');
    questionsLimitSelect.change(init_questions);
    questionsSortSelect.change(init_questions);

    //init answers
    const answersDivList = $('#userAnswersList');
    const answersLimitSelect = $('#answersLimitSelect');
    const answersSortSelect = $('#answersSortSelect');
    answersLimitSelect.change(init_answers);
    answersSortSelect.change(init_answers);


    init_page();
    init_questions();
    init_answers();

    personalInfoChangePasswordButton.click(function(event){
        event.preventDefault();
        changePasswordDiv.show();
        personalInfoChangePasswordButton.hide();
    })

    changePasswordFormSubmitButton.click(function(event){
        event.preventDefault();
        try {
            checkPassword($('#changePasswordFormOldPassword').val(), $('#changePasswordFormNewPassword').val(), $('#changePasswordFormNewPasswordCheck').val());
        } catch (error) {
            changePasswordFormStatus.html(`${error}`);
        }
        changePasswordFormStatus.show();
    })




 

    function init_page(){
        changePasswordDiv.hide();
        changePasswordFormStatus.hide();
    }
    function checkPassword(oldPassword, newPassword, newPassword2){
        try {
            checkPasswordLegal("oldPassword", oldPassword);
            checkPasswordLegal("newPassword", newPassword);
            checkPasswordLegal("newPassword", newPassword2);
        } catch (error) {
            throw(error)
        }
        if(newPassword !== newPassword2){
            throw("Two input new password must be consistent");
        }
        if(newPassword === oldPassword){
            throw("The new password can not be same as the old password!");
        }

        let targetUrl = "/user/changePassword";
        let requestConfig = {
            method: 'POST',
            url: targetUrl,
            contentType: 'application/json',
            data: JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if(responseMessage.status === true){
                changePasswordFormStatus.html("Password Changed successfully!");
            }
            else{
                changePasswordFormStatus.html(`${responseMessage.message}`);
            } 
        });


        function checkPasswordLegal(variabName, password){
            if (typeof password !== 'string') throw (`${variabName} must be a string`);
            if (password.trim().length < 6 ) throw (`the length of ${variabName} must be at least 6`);

        }
    }

    function init_questions(limit = "10", sort = "date"){

        limit = questionsLimitSelect.find(":selected").text();
        sort = questionsSortSelect.find(":selected").text();
        questionsDivList.empty();
        let targetUrl = `/user/getQuestions`;
        let requestConfig = {
            method: 'POST',
            url: targetUrl,
            contentType: 'application/json',
            data: JSON.stringify({
            limit: limit,
            sort: sort
        })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            const userQuestionsList = responseMessage.userQuestionsList;
            // add the selection form
            // const limitSelect = $(
            //     `<select id="LimitSelect">
            //         <option value="10">10</option>
            //         <option value="20">20</option>
            //         <option value="50">50</option>
            //     </select>`);
            // const sortSelect = $(
            //     `<select id="sortSelect">
            //         <option value="Date from new to old">date</option>
            //         <option value="Answers number from high to low">answer</option>
            //     </select>`
            // );
            // limitSelect.val = limit;
            // if(sort === "date"){
            //     sortSelect.val = "Date from new to old"
            // }else{
            //     sortSelect.val = "Answers number from high to low"
            // }
            
            //add the select form
            // questionsDivList.append($('<label for="sortSelect">Sort: </label>'))
            // questionsDivList.append(sortSelect);
            // questionsDivList.append($('<br>'));
            // questionsDivList.append($('<label for="LimitSelect">Limit: </label>'))
            // questionsDivList.append(limitSelect);
            // questionsDivList.append($('<br>'));
            let questionTable = $(`
                <table>
                    <caption>Questions you asked</caption>         
                <tr>
                    <th>Question</th>
                    <th>Number of answers</th>
                    <th>Created at</th>
                    <th>Delete the Question?</th>
                </tr>
                </table>
            `)
            //add the questions list
            for(let i =0; i < userQuestionsList.length; i++)
            {
                let newTableRow = $(`<tr></tr>`);
                let question = userQuestionsList[i];
                let questionA = $(`<a class="questionsListQuestion" id="question_${question.questionId}" href="${question.questionUrl}">${question.questionName}</a>`);
                let questionDelete = $(`<a href="" id="question_delete_${question.questionId}"></a>`);
                questionDelete.text("delete");
                questionDelete.click(deleteQuestion);
                let questionATD = $(`<td></td>`);
                questionATD.append(questionA);
                let questionDeleteTD = $(`<td></td>`);
                questionDeleteTD.append(questionDelete);
                // let h2 = $(`<h2></h2>`);
                // let article = $(`<article></article>`);
                newTableRow.append(questionATD);
                newTableRow.append($(`<td><P>${question.numberOfAnswers}</P></td>`));
                newTableRow.append($(`<td><P>${question.createdAt}</P></td>`));
                newTableRow.append(questionDeleteTD);
                questionTable.append(newTableRow);
            }
            questionsDivList.append(questionTable);
            questionsDivList.show();
        });
    }

    function deleteQuestion(event){
        event.preventDefault();
        let id = event.target.id.split("_")[2];
        let targetUrl = "/user/deleteQuestion";
        let requestConfig = {
            method: 'POST',
            url: targetUrl,
            contentType: 'application/json',
            data: JSON.stringify({
            questionId: id
        })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if(responseMessage.status === true){
                let questionA = $(`#question_${id}`);
                let questionDelete = $(`#question_delete_${id}`);
                questionA.removeAttr("href");
                questionDelete.removeAttr("href");
                questionDelete.text("deleted");
            }
            else{
                console.log("fail");
            } 
        });
    }

    function init_answers(limit = "10", sort = "date"){

        limit = answersLimitSelect.find(":selected").text();
        sort = answersSortSelect.find(":selected").text();
        answersDivList.empty();
        let targetUrl = `/user/getAnswers`;
        let requestConfig = {
            method: 'POST',
            url: targetUrl,
            contentType: 'application/json',
            data: JSON.stringify({
            limit: limit,
            sort: sort
        })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            const userAnswersList = responseMessage.userAnswersList;

            let answerTable = $(`
                <table>
                    <caption>Questions you answered</caption>         
                <tr>
                    <th>Question</th>
                    <th>Your Answer</th>
                    <th>Vote Up</th>
                    <th>Vote Down</th>
                    <th>Reviews</th>
                    <th>Created at</th>
                    <th>Delete the Answer?</th>
                </tr>
                </table>
            `)
            //add the answers list
            for(let i =0; i < userAnswersList.length; i++)
            {
                let answer = userAnswersList[i];
                let answerQuestionA = $(`<a class="answersListQuestion" href="${answer.questionUrl}">${answer.questionName}</a>`);
                
                let answerDelete = $(`<a href="" id="answer_delete_${answer.answerId}"></a>`);
                answerDelete.text("delete");
                answerDelete.click(deleteAnswer);
                let answerQuestionATD = $(`<td></td>`);
                answerQuestionATD.append(answerQuestionA);
                let answerDeleteTD = $(`<td></td>`);
                answerDeleteTD.append(answerDelete);

                //generate reviews
                let answerReviewsTD = $('<td></td>');
                let AnswerReviewsUL = $('<ul></ul>');
                for(let j = 0; j < answer["reviews"].length; j++ ){
                    let reviewLI = $(`<li>${answer["reviews"][j]}</li>`);
                    AnswerReviewsUL.append(reviewLI);
                }
                answerReviewsTD.append(AnswerReviewsUL);

                //add table data to new row
                let newTableRow = $(`<tr></tr>`);
                newTableRow.append(answerQuestionATD);
                newTableRow.append($(`<td><P>${answer["answerContent"]}</P></td>`));
                newTableRow.append($(`<td><P>${answer["numberOfVoteUp"]}</P></td>`));
                newTableRow.append($(`<td><P>${answer["numberOfVoteDown"]}</P></td>`));
                newTableRow.append(answerReviewsTD);
                newTableRow.append($(`<td><P>${answer["recentUpdatedTime"]}</P></td>`));
                newTableRow.append(answerDeleteTD);
                answerTable.append(newTableRow);
            }
            answersDivList.append(answerTable);
            answersDivList.show();
        });
    }

    function deleteAnswer(event){
        event.preventDefault();
        let id = event.target.id.split("_")[2];
        let targetUrl = "/user/deleteAnswer";
        let requestConfig = {
            method: 'POST',
            url: targetUrl,
            contentType: 'application/json',
            data: JSON.stringify({
            answerId: id
        })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if(responseMessage.status === true){
                let answerDelete = $(`#answer_delete_${id}`);
                answerDelete.removeAttr("href");
                answerDelete.text("deleted");
            }
            else{
                console.log("fail");
            } 
        });
    }
})(window.jQuery);