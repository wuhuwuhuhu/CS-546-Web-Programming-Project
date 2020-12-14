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
        var a=$(this).attr("id");
        console.log(typeof(a));
        a="ReviewNumberIdShow"+a.replace("ReviewNumberId","")
        $("#"+a).toggle()
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
                // const newDataList=responseMessage
            }
            else {
                addAnswerFailed.show()
                addAnswerFailed.delay(3000).hide(0);
            }
        });
    });

    hidTest.click(function (event) {
        let va = hidTest.find(":selected").text();
        console.log(va);
        console.log('hahha');
    });
})(jQuery);