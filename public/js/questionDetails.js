(function ($) {
    const answerSubmit = $('#answerSubmit')
    const answerContent = $('#answerContent')
    const quesId = $('#quesId')
    const mainTable = $('#mainTable')
    const addAnswerSuccessful = $('#addAnswerSuccessful')
    const addAnswerFailed = $('#addAnswerFailed')
    const hidTest = $('#hidTest')
    const questionInfo = $('#questionInfo')
    $('[id^="ReviewNumber"]').hide();
    addAnswerSuccessful.hide()
    addAnswerFailed.hide()

    $('.ReviewNumberShowButton').click(function () {
        var a = $(this).attr("id");
        console.log(typeof (a));
        a = "ReviewNumberIdShow" + a.replace("ReviewNumberId", "")
        $("#" + a).toggle()
    });

    answerSubmit.click(function (event) {
        event.preventDefault();
        var content = answerContent.val();
        const questionId = quesId.text()
        console.log(questionId);
        let url = '/question/addAnswer/' + questionId
        var requestConfig = {
            method: 'POST',
            url: url,
            contentType: 'application/json',
            data: JSON.stringify({
                content: content,
                questionId: questionId,
            })
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            if (responseMessage.status === true) {
                addAnswerSuccessful.show()
                addAnswerSuccessful.delay(3000).hide(0);
                mainTable.empty()
                const newAnswerList = responseMessage.newAnswerList
                AnalysAnswerListToHTML(newAnswerList)
            }
            else {
                addAnswerFailed.show()
                addAnswerFailed.delay(3000).hide(0);
            }
        });
    });


    function AnalysAnswerListToHTML(newAnswerList) {
        const tableCaption = " <caption>Show your ideas</caption>"
        mainTable.append(tableCaption)
        let listLen = newAnswerList.length
        var tableThead = "<thead> <tr><th>" + listLen + " answers<button style=\"margin:5px\" class=\"btn btn-primary pull-right\">sorted by most recent</button><button style=\"margin:5px\" class=\"btn btn-primary pull-right\">sorted by most popular</button></th> </tr> </thead>"
        mainTable.append(tableThead)
        var tableBody;

        mainTable.append("<tbody>")
        for (let index = 0; index < newAnswerList.length; index++) {
            const curAnswer = newAnswerList[index];
            //sub tables
            var subTable="<tr><td><table class=\"questionInnerTable\">"
            // subTable+="<tr>"
            const curAnswerContent = curAnswer.content
            // subTable=" <td class=\"questionInnerTableTr-1\"><p class=\"text-primary\">"+curAnswerContent+"</p></td>"
        //     const reviewList = curAnswer.reviews
        //     // for (let j = 0; j < curAnswer.length; j++) {
        //     //     const curReview = curAnswer[j];

        //     // }
        //     subTable+"</tr>"
        //     mainTable.append(subTable)
            subTable=subTable+"</tr></td></tr>"
            mainTable.append(subTable)
        }

        mainTable.append("</tbody>")

    }

    hidTest.click(function (event) {
        let va = hidTest.find(":selected").text();
        console.log(va);
        console.log('hahha');
    });
})(jQuery);