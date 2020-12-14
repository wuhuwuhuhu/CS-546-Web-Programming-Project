(function ($) {
    const changePasswordDiv = $('#changePassword');
    const changePasswordFormSubmitButton = $('#changePasswordFormSubmitButton');
    const changePasswordFormStatus = $('#changePasswordFormStatus');
    const personalInfoChangePasswordButton = $('#personalInfoChangePasswordButton')
    //init
    

    //bind questions
    const questionsDivList = $('#userQuestionsList');
    const questionsLimitSelect = $('#questionsLimitSelect');
    const questionsSortSelect = $('#questionsSortSelect');
    questionsLimitSelect.change(init_questions);
    questionsSortSelect.change(init_questions);

    //bind answers
    const answersDivList = $('#userAnswersList');
    const answersLimitSelect = $('#answersLimitSelect');
    const answersSortSelect = $('#answersSortSelect');
    answersLimitSelect.change(init_answers);
    answersSortSelect.change(init_answers);

    //bind reviews
    const reviewsDivList = $('#userReviewsList');
    const reviewsLimitSelect = $('#reviewsLimitSelect');
    const reviewsSortSelect = $('#reviewsSortSelect');
    reviewsLimitSelect.change(init_reviews);
    reviewsSortSelect.change(init_reviews);

    //bind votedAnswers
    const votedAnswersDivList = $('#userVotedAnswersList');
    const votedAnswersLimitSelect = $('#votedAnswersLimitSelect');
    const votedAnswersSortSelect = $('#votedAnswersSortSelect');
    votedAnswersLimitSelect.change(init_votedAnswers);
    votedAnswersSortSelect.change(init_votedAnswers);

    //bind votedReviews
    const votedReviewsDivList = $('#userVotedReviewsList');
    const votedReviewsLimitSelect = $('#votedReviewsLimitSelect');
    const votedReviewsSortSelect = $('#votedReviewsSortSelect');
    votedReviewsLimitSelect.change(init_votedReviews);
    votedReviewsSortSelect.change(init_votedReviews);



    init_page();
    init_questions();
    init_answers();
    init_reviews();
    init_votedAnswers();
    init_votedReviews();

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
                    <th>Updated at</th>
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

    //reviews
    function init_reviews(limit = "10", sort = "date"){

        limit = reviewsLimitSelect.find(":selected").text();
        sort = reviewsSortSelect.find(":selected").text();
        reviewsDivList.empty();
        let targetUrl = `/user/getReviews`;
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
            const userReviewsList = responseMessage.userReviewsList;

            let reviewTable = $(`
                <table>
                    <caption>Answers you reviewed</caption>         
                <tr>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Your Review</th>
                    <th>Vote Up</th>
                    <th>Vote Down</th>
                    <th>Updated at</th>
                    <th>Delete the Review?</th>
                </tr>
                </table>
            `)
            //add the reviews list
            for(let i =0; i < userReviewsList.length; i++)
            {
                let review = userReviewsList[i];
                let reviewQuestionA = $(`<a class="reviewsListQuestion" href="${review.questionUrl}">${review.questionName}</a>`);
                
                let reviewDelete = $(`<a href="" id="review_delete_${review.reviewId}"></a>`);
                reviewDelete.text("delete");
                reviewDelete.click(deleteReview);
                let reviewQuestionATD = $(`<td></td>`);
                reviewQuestionATD.append(reviewQuestionA);
                let reviewDeleteTD = $(`<td></td>`);
                reviewDeleteTD.append(reviewDelete);

                //add table data to new row
                let newTableRow = $(`<tr></tr>`);
                newTableRow.append(reviewQuestionATD);
                newTableRow.append($(`<td><P>${review["answerContent"]}</P></td>`));
                newTableRow.append($(`<td><P>${review["reviewContent"]}</P></td>`));
                newTableRow.append($(`<td><P>${review["numberOfVoteUp"]}</P></td>`));
                newTableRow.append($(`<td><P>${review["numberOfVoteDown"]}</P></td>`));
                newTableRow.append($(`<td><P>${review["recentUpdatedTime"]}</P></td>`));
                newTableRow.append(reviewDeleteTD);
                reviewTable.append(newTableRow);
            }
            reviewsDivList.append(reviewTable);
            reviewsDivList.show();
        });
    }

    function deleteReview(event){
        event.preventDefault();
        let id = event.target.id.split("_")[2];
        let targetUrl = "/user/deleteReview";
        let requestConfig = {
            method: 'POST',
            url: targetUrl,
            contentType: 'application/json',
            data: JSON.stringify({
            reviewId: id
        })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            if(responseMessage.status === true){
                let reviewDelete = $(`#review_delete_${id}`);
                reviewDelete.removeAttr("href");
                reviewDelete.text("deleted");
            }
            else{
                console.log("fail");
            } 
        });
    }
    
//votedAnswers
function init_votedAnswers(limit = "10", sort = "date"){

    limit = votedAnswersLimitSelect.find(":selected").text();
    sort = votedAnswersSortSelect.find(":selected").text();
    votedAnswersDivList.empty();
    let targetUrl = `/user/getVotedAnswers`;
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
        const userVotedAnswersList = responseMessage.userVotedAnswersList;

        let votedAnswerTable = $(`
            <table>
                <caption>Answers you voted</caption>         
            <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Vote Up</th>
                <th>Vote Down</th>
                <th>Answer Updated At</th>
                <th>Your Vote</th>
            </tr>
            </table>
        `)

        //add the votedAnswers list
        for(let i =0; i < userVotedAnswersList.length; i++)
        {
            let votedAnswer = userVotedAnswersList[i];
            let votedAnswerQuestionA = $(`<a class="votedAnswersListQuestion" href="${votedAnswer.questionUrl}">${votedAnswer.questionName}</a>`);
            
            let votedAnswerVoteUp = $(`<a href="" id="votedAnswer_voteUp_votedAnswerId_${votedAnswer.votedAnswerId}_VotedAnswerUserId_${votedAnswer.VotedAnswerUserId}"></a>`);
            votedAnswerVoteUp.text(" Vote Up ");

            let votedAnswerVoteDown = $(`<a href="" id="votedAnswer_voteDown_votedAnswerId_${votedAnswer.votedAnswerId}_VotedAnswerUserId_${votedAnswer.VotedAnswerUserId}"></a>`);
            votedAnswerVoteDown.text(" Vote Down ");

            if(votedAnswer["IsVoteUp"]){
                votedAnswerVoteUp.text(" Voted Up ");
                votedAnswerVoteUp.removeAttr("href");
            }
            else{
                votedAnswerVoteDown.text(" Voted Down ");
                votedAnswerVoteDown.removeAttr("href");
            }

            votedAnswerVoteUp.click(updateVotedAnswer);
            votedAnswerVoteDown.click(updateVotedAnswer);

            let votedAnswerQuestionATD = $(`<td></td>`);
            votedAnswerQuestionATD.append(votedAnswerQuestionA);
            let votedAnswerUpdateTD = $(`<td></td>`);
            votedAnswerUpdateTD.append(votedAnswerVoteUp);
            votedAnswerUpdateTD.append(votedAnswerVoteDown);

            //add table data to new row
            let newTableRow = $(`<tr></tr>`);
            newTableRow.append(votedAnswerQuestionATD);
            newTableRow.append($(`<td><P>${votedAnswer["answerContent"]}</P></td>`));
            //newTableRow.append($(`<td><P>${review["reviewContent"]}</P></td>`));
            newTableRow.append($(`<td><P>${votedAnswer["numberOfVoteUp"]}</P></td>`));
            newTableRow.append($(`<td><P>${votedAnswer["numberOfVoteDown"]}</P></td>`));
            newTableRow.append($(`<td><P>${votedAnswer["recentUpdatedTime"]}</P></td>`));
            newTableRow.append(votedAnswerUpdateTD);
            votedAnswerTable.append(newTableRow);
        }
        votedAnswersDivList.append(votedAnswerTable);
        votedAnswersDivList.show();
    });
}

function updateVotedAnswer(event){
    event.preventDefault();
    //votedAnswer_voteDown_votedAnswerId_${votedAnswer.votedAnswerId}_VotedAnswerUserId_${votedAnswer.VotedAnswerUserId}
    let desVoteId = event.target.id;
    if($(`#${desVoteId}`).text().trim().split(" ")[0] === "Voted"){
        return;
    }
    let answerId = desVoteId.split("_")[3];
    let userId = desVoteId.split("_")[5];
    let desVoteStatus = desVoteId.split("_")[1];
    let originVoteStatusId;
    if(desVoteStatus === "voteUp")
    {
        originVoteStatusId = `votedAnswer_voteDown_votedAnswerId_${answerId}_VotedAnswerUserId_${userId}`;
    }else{
        originVoteStatusId = `votedAnswer_voteUp_votedAnswerId_${answerId}_VotedAnswerUserId_${userId}`;
    }
    let targetUrl = "/user/updateVoteAnswer";
    let requestConfig = {
        method: 'POST',
        url: targetUrl,
        contentType: 'application/json',
        data: JSON.stringify({
            answerId: answerId,
            userId: userId
    })
    };
    $.ajax(requestConfig).then(function (responseMessage) {
        if(responseMessage.status === true){
            let desVoteA = $(`#${desVoteId}`);
            let originVoteA = $(`#${originVoteStatusId}`);
            if(desVoteStatus === "voteUp"){
                desVoteA.removeAttr("href");
                desVoteA.text(" Voted Up ");
                originVoteA.attr("href", "");
                originVoteA.text(" Vote Down");
            }else{
                desVoteA.removeAttr("href");
                desVoteA.text(" Voted Down ");
                originVoteA.attr("href", "");
                originVoteA.text(" Vote Up");
            }

        }
        else{
            console.log("fail");
        } 
    });
}

// voted reviews
function init_votedReviews(limit = "10", sort = "date"){

    limit = votedReviewsLimitSelect.find(":selected").text();
    sort = votedReviewsSortSelect.find(":selected").text();
    votedReviewsDivList.empty();
    let targetUrl = `/user/getVotedReviews`;
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
        const userVotedReviewsList = responseMessage.userVotedReviewsList;

        let votedReviewTable = $(`
            <table>
                <caption>Reviews you voted</caption>         
            <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Review</th>
                <th>Vote Up</th>
                <th>Vote Down</th>
                <th>Review Updated At</th>
                <th>Your Vote</th>
            </tr>
            </table>
        `)

        //add the votedReviews list
        for(let i =0; i < userVotedReviewsList.length; i++)
        {
            let votedReview = userVotedReviewsList[i];
            let votedReviewQuestionA = $(`<a class="votedReviewsListQuestion" href="${votedReview.questionUrl}">${votedReview.questionName}</a>`);
            
            let votedReviewVoteUp = $(`<a href="" id="votedReview_voteUp_votedReviewId_${votedReview.votedReviewId}_VotedReviewUserId_${votedReview.VotedReviewUserId}"></a>`);
            votedReviewVoteUp.text(" Vote Up ");

            let votedReviewVoteDown = $(`<a href="" id="votedReview_voteDown_votedReviewId_${votedReview.votedReviewId}_VotedReviewUserId_${votedReview.VotedReviewUserId}"></a>`);
            votedReviewVoteDown.text(" Vote Down ");

            if(votedReview["IsVoteUp"]){
                votedReviewVoteUp.text(" Voted Up ");
                votedReviewVoteUp.removeAttr("href");
            }
            else{
                votedReviewVoteDown.text(" Voted Down ");
                votedReviewVoteDown.removeAttr("href");
            }

            votedReviewVoteUp.click(updateVotedReview);
            votedReviewVoteDown.click(updateVotedReview);

            let votedReviewQuestionATD = $(`<td></td>`);
            votedReviewQuestionATD.append(votedReviewQuestionA);
            let votedReviewUpdateTD = $(`<td></td>`);
            votedReviewUpdateTD.append(votedReviewVoteUp);
            votedReviewUpdateTD.append(votedReviewVoteDown);

            //add table data to new row
            let newTableRow = $(`<tr></tr>`);
            newTableRow.append(votedReviewQuestionATD);
            newTableRow.append($(`<td><P>${votedReview["answerContent"]}</P></td>`));
            newTableRow.append($(`<td><P>${votedReview["reviewContent"]}</P></td>`));
            newTableRow.append($(`<td><P>${votedReview["numberOfVoteUp"]}</P></td>`));
            newTableRow.append($(`<td><P>${votedReview["numberOfVoteDown"]}</P></td>`));
            newTableRow.append($(`<td><P>${votedReview["recentUpdatedTime"]}</P></td>`));
            newTableRow.append(votedReviewUpdateTD);
            votedReviewTable.append(newTableRow);
        }
        votedReviewsDivList.append(votedReviewTable);
        votedReviewsDivList.show();
    });
}

function updateVotedReview(event){
    event.preventDefault();
    //votedReview_voteDown_votedReviewId_${votedReview.votedReviewId}_VotedReviewUserId_${votedReview.VotedReviewUserId}
    let desVoteId = event.target.id;
    if($(`#${desVoteId}`).text().trim().split(" ")[0] === "Voted"){
        return;
    }
    let reviewId = desVoteId.split("_")[3];
    let userId = desVoteId.split("_")[5];
    let desVoteStatus = desVoteId.split("_")[1];
    let originVoteStatusId;
    if(desVoteStatus === "voteUp")
    {
        originVoteStatusId = `votedReview_voteDown_votedReviewId_${reviewId}_VotedReviewUserId_${userId}`;
    }else{
        originVoteStatusId = `votedReview_voteUp_votedReviewId_${reviewId}_VotedReviewUserId_${userId}`;
    }
    let targetUrl = "/user/updateVoteReview";
    let requestConfig = {
        method: 'POST',
        url: targetUrl,
        contentType: 'application/json',
        data: JSON.stringify({
            reviewId: reviewId,
            userId: userId
    })
    };
    $.ajax(requestConfig).then(function (responseMessage) {
        if(responseMessage.status === true){
            let desVoteA = $(`#${desVoteId}`);
            let originVoteA = $(`#${originVoteStatusId}`);
            if(desVoteStatus === "voteUp"){
                desVoteA.removeAttr("href");
                desVoteA.text(" Voted Up ");
                originVoteA.attr("href", "");
                originVoteA.text(" Vote Down");
            }else{
                desVoteA.removeAttr("href");
                desVoteA.text(" Voted Down ");
                originVoteA.attr("href", "");
                originVoteA.text(" Vote Up");
            }

        }
        else{
            console.log("fail");
        } 
    });
}
})(window.jQuery);