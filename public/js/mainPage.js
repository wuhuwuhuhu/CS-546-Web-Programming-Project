showMostPopularItem()

$('#timeButton').click((event)=>{
    event.preventDefault();
    $('#Myform').hide();
    $('#searchResult').hide();
    $('#popularQuestion').hide();
    $('#myNewForm').show();
    $("#newSearchResult").show();
    $('#newPopularQuestion').show();
    $('#myHotForm').hide();
    $('#hotSearchResult').hide();
    $('hotPopularQuestion').hide();
})

showMostPopularItem()
$('#Myform').submit((event)=>{
    event.preventDefault();
    $('#error-container').hide();
    if($('#text_input').val()){
        $('#popularQuestion').hide();
        $('#searchResult').children().remove();
        let searchAnswer = search($('#text_input').val());
        console.log(searchAnswer);
    }
    else{
        $('#error-container').show();
        let tag ="<a>You must enter some words to search!!</a>"
        $('#error-container').append(tag)

    }
});


$('#myNewForm').submit((event)=>{
    event.preventDefault();
    $('#error-container').hide();
    if($('#text_input2').val()){
        $('#newPopularQuestion').hide();
        $('#newSearchResult').children().remove();
        let searchAnswer = searchNew($('#text_input2').val());
        console.log(searchAnswer);
    }
    else{
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
            for(i=0;i<responseMessage.returnSearch.length;i++){
                let li ='<li><a href=question/'+responseMessage.returnSearch[i]._id+'>'+responseMessage.returnSearch[i].content+'</a></li>' ;
                $('#searchResult').append(li);
            }
        }
    })

    //must return a Array of searchAnswer, the search answer must be a object, key:url and key:title(must be string);

}
function searchNew(item){
    $('#newSearchResult').show();
    let search ={
        method:'POST',
        url:'/searchNew',
        contentType: 'application/json',
        data: JSON.stringify({
            data: item
        })
    }

    $.ajax(search).then(function(responseMessage){
        console.log(responseMessage)
        for(i=0;i<responseMessage.returnSearch.length;i++){
            let li ='<li><a href=question/'+responseMessage.returnSearch[i]._id+'>'+responseMessage.returnSearch[i].content+'</a></li>' ;
            $('#searchResult').append(li);
        }
    })
}