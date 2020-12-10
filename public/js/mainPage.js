$('#Myform').submit((event)=>{
    event.preventDefault();
    if($('#text_input').val()){
        $('#searchError').hide();
        $('#searchResult').show();
        let searchAnswer = searchAnswer($('#text_input'));
        for(let i=0;i<searchAnswer.length;i++){
            let li = '<li href='+searchAnswer[i][url]+' >'+searchAnswer[i][title]+'</li>';
            $('#searchResult').append(li);
            $('text_input').focus();
        }
    }
    else{
        $('#searchError').show();
        $('#searchError').html('You must enter something to search');
        $('text_input').focus();
    }
});

let mostPopularQuestion = mostPopularQuestion();
for(i=0;i<5;i++){
    let li='<li href='+mostPopularQuestion[i][url]+' >'+mostPopularQuestion[i][title]+'</li>';
    $('popularQuestion').append(li);
    
}

function searchAnswer(item){
    let search ={
        method:'GET',
        url:'/main/searchAnswer',
        contentType: 'application/json',
        data: JSON.stringify({
            data = item
        })
    }
    $.ajax(search).then(function(responseMessage){
        
    })
    //must return a Array of searchAnswer, the search answer must be a object, key:url and key:title(must be string);

}

function mostPopularQuestion(){
    //must renturn a Array of Question, with the 5 most popular questions, each element must be a object, key:url, key:title(must be string)
}