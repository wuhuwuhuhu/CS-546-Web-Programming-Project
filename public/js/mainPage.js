const questionsLimitSelect = $('#questionsLimitSelect');
const questionsSortSelect = $('#questionsSortSelect');
const questionTopicSelect = $('#questionsTopicSelect');
const questionSearch = $("#text_input");
showMostPopularItem()


questionsLimitSelect.change((event)=>{
    $('#error-container').hide();
    if($('#text_input').val()){
        let limit = questionsLimitSelect.find(":selected").text();
        let sort = questionsSortSelect.find(":selected").text();
        let topic = questionTopicSelect.find(":selected").text();
        let keywords = questionSearch.val();
        $("#questionList").children().remove();
        search(keywords,topic,sort,limit);
    }
    else{
        $('#questionList').hide();
        $('#error-container').children().remove();
        $('#error-container').show();
        let tag ="<a>You must enter some words to search!!</a>"
        $('#error-container').append(tag)

    }
})

questionsSortSelect.change((event)=>{
    $('#error-container').hide();
    if($('#text_input').val()){
        let limit = questionsLimitSelect.find(":selected").text();
        let sort = questionsSortSelect.find(":selected").text();
        let topic = questionTopicSelect.find(":selected").text();
        let keywords = questionSearch.val();
        $("#questionList").children().remove();
        search(keywords,topic,sort,limit);
    }
    else{
        $('#questionList').hide();
        $('#error-container').children().remove();
        $('#error-container').show();
        let tag ="<a>You must enter some words to search!!</a>"
        $('#error-container').append(tag)

    }
})

questionTopicSelect.change((event)=>{
    $('#error-container').hide();
    if($('#text_input').val()){
        let limit = questionsLimitSelect.find(":selected").text();
        let sort = questionsSortSelect.find(":selected").text();
        let topic = questionTopicSelect.find(":selected").text();
        let keywords = questionSearch.val();
        $("#questionList").children().remove();
        search(keywords,topic,sort,limit);
    }
    else{
        $('#questionList').hide();
        $('#error-container').children().remove();
        $('#error-container').show();
        let tag ="<a>You must enter some words to search!!</a>"
        $('#error-container').append(tag)

    }
})

$('#Myform').submit((event)=>{
    event.preventDefault();
    $('#error-container').hide();
    if($('#text_input').val()){
        $("#questionsSelector").show()
        let limit = questionsLimitSelect.find(":selected").text();
        let sort = questionsSortSelect.find(":selected").text();
        let topic = questionTopicSelect.find(":selected").text();
        let keywords = questionSearch.val();
        $("#questionList").children().remove();
        search(keywords,topic,sort,limit);
    }
    else{
        $('#questionList').hide();
        $('#error-container').children().remove();
        $('#error-container').show();
        let tag ="<a>You must enter some words to search!!</a>"
        $('#error-container').append(tag)

    }
});




function search(keywords,topic,sort,limit){
    let search ={
        method:'POST',
        url:'/search',
        contentType: 'application/json',
        data: JSON.stringify({
            keywords: keywords,
            sort : sort,
            topic : topic,
            limit: limit
        })
    }

    $.ajax(search).then(function(responseMessage){
        if(responseMessage.A.length==0){
            $('#error-container').children().remove();
            $('#error-container').show();
            $('#error-container').append("<p>No search answer!!</p>")
        }
        else{
            $("#questionList").children().remove();
            $("#questionList").show();
            for(let i=0;i<responseMessage.A.length;i++){
                let li = "<li><a href=question/"+responseMessage.A[i]._id+">"+responseMessage.A[i].content+"</a></li>";
                $("#questionList").append(li);
            }
        }
    })
}

function showMostPopularItem(){
    $('#questionList').children().remove();
    let mostPopular = {
        method:'POST',
        url:'/popular',
        contentType: 'application/json',
        data: JSON.stringify({
            ask:true
        })
    }
    $.ajax(mostPopular).then(function(responseMessage){
        console.log(responseMessage);
        for(let i=0;i<20;i++){
            let li = '<li><a href=question/'+responseMessage.returnPopular[i]._id+' >'+responseMessage.returnPopular[i].content+'</a></li>';
            $('#questionList').append(li);
        }
        
    })
}