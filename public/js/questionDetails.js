(function ($) {
    const answerSubmit = $('#answerSubmit')
    const answerContent = $('#answerContent')
    const quesId = $('#quesId')
    const mainTable = $('mainTable')
    answerSubmit.click(function (event) {
        event.preventDefault();
        var userId = $.session.get('key');
        
        console.log(userId);
        var content = answerContent.val();
        const questionId=quesId.text()
        var requestConfig = {
            method: 'POST',
            url: '/',
            contentType: 'application/json',
            data: JSON.stringify({
                content: content,
                questionId: questionId,

            })
        };


    });
})(jQuery);