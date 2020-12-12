showMostPopularItem()

$('#timeButton').click((event)=>{
    event.preventDefault();
    $('#Myform').hide();
    $('#searchResult').hide();
    $('#popularQuestion').hide();

})

$('#Myform').submit((event)=>{
    event.preventDefault();
    $('#error-container').hide();
    if($('#text_input').val()){
        $('#popularQuestion').hide();
        $('#searchResult').children().remove();
        $('#timeButton').show();
        $('#popularButton').show();
        let searchAnswer = search($('#text_input').val());
        console.log(searchAnswer);
    }
    else{
        $('#timeButton').hide();
        $('#popularButton').hide();
        $('#searchResult').hide();
        $('#error-container').show();
        let tag ="<a>You must enter some words to search!!</a>"
        $('#error-container').append(tag)

    }
});



function showMostPopularItem(){
    $('#searchResult').hide();
    $('#popularQuestion').children().remove();
    let mostPopular = {
        method:'POST',
        url:'/popular',
        contentType: 'application/json',
        data: JSON.stringify({
            ask:true
        })
    }
    $('#popularQuestion').show()
    $.ajax(mostPopular).then(function(responseMessage){
        for(let i=0;i<5;i++){
            let li = '<li><a href=question/'+responseMessage.returnPopular[i]._id+' >'+responseMessage.returnPopular[i].content+'</a></li>';
            $('#popularQuestion').append(li);
        }
        
    })
}

function search(item){
    $('#searchResult').show();
    let search ={
        method:'POST',
        url:'/search',
        contentType: 'application/json',
        data: JSON.stringify({
            data: item
        })
    }

    $.ajax(search).then(function(responseMessage){
        if(responseMessage.returnSearch.length==0){
            $('#error-container').children().remove();
            $('#error-container').show();
            $('#error-container').append("<p>No search answer!!</p>")
        }
        else{
            return responseMessage.returnSearch;
        }
    })

    //must return a Array of searchAnswer, the search answer must be a object, key:url and key:title(must be string);

}


async  function sortQuestionsByTime(questionlist,limit){
    if(!questionlist) throw 'questions.js|sortQuestionByTime: questionlist does not exist'
    if(!Array.isArray(questionlist) || questionlist.length === 0) throw 'questions.js|sortQuestionByTime: input questionlist should be non-empty array'
    if(typeof limit === 'undefined') throw 'questions.js|sortQuestionByTime: limit number does not exist'
    if(typeof limit !== 'number' ) throw 'questions.js|sortQuestionByTime:limit is a number'

    if(questionlist.length >=2){
        questionlist.sort(function compare(a,b){
            let x = new Date(a.questionCreatedTime);
            let y = new Date(b.questionCreatedTime)
            return y - x;
        })
        if(questionlist.length >= limit && limit >= 0){
            let result = questionlist.slice(0,limit);
            return result
        }

    }
    return questionlist;

}
//sort arry by answers number with output in limit number, no limit if limit < 0
async function sortQuestionsByAnsNum(questionlist,limit){
    if(!questionlist) throw 'questions.js|sortQuestionByTime: questionlist does not exist'
    if(!Array.isArray(questionlist) || questionlist.length === 0) throw 'questions.js|sortQuestionByTime: input questionlist should be non-empty array'
    if(typeof limit === 'undefined') throw 'questions.js|sortQuestionByTime: limit number does not exist'
    if(typeof limit !== 'number') throw 'questions.js|sortQuestionByTime:limit is a number'

    if(questionlist.length >=2){
        questionlist.sort(function compare(a,b){				
            return b.answers.length - a.answers.length;
        })
        if(questionlist.length >= limit && limit >= 0){
            let result = questionlist.slice(0,limit);
            return result
        }
    }

    return questionlist;

}