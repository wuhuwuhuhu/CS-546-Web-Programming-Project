(function ($) {
    const answerSubmit = $('#answerSubmit')
    const answerContent=$('#answerContent')
    const quesId=$('#quesId')

    answerSubmit.click(function (event) {
        event.preventDefault();
        var answer = answerContent.val();
        console.log(answer);
        console.log(quesId.text());
        
    });
})(jQuery);