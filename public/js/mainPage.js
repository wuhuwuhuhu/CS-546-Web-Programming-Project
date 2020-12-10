$('#Myform').submit((event)=>{
    event.preventDefault();
    $('#popularQuestion').hide();
    if($('#text_input').val()){
        $('#searchResult').children().remove();
        $('#searchResult').show();
        let searchAnswer = search($('#text_input').val());
        console.log(searchAnswer);
        for(let i=0;i<searchAnswer.length;i++){
            let li = '<li href='+searchAnswer[i][url]+' >'+searchAnswer[i][title]+'</li>';
            $('#searchResult').append(li);
            $('text_input').focus();
        }
    }
    else{
        alert("You must input something to search!")
    }
});
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
        let li = '<li><a href='+responseMessage.returnPopular[i].url+' >'+responseMessage.returnPopular[i].name+'</a></li>';
        $('#popularQuestion').append(li);
    }
    
})






function search(item){
    let search ={
        method:'POST',
        url:'/search',
        contentType: 'application/json',
        data: JSON.stringify({
            data: item
        })
    }

    $.ajax(search).then(function(responseMessage){
        for(i=0;i<responseMessage.returnSearch.length;i++){
            let li ='<li><a href='+responseMessage.returnSearch[i].url+'>'+responseMessage.returnSearch[i].name+'</a></li>' ;
            $('#searchResult').append(li);
        }
    })

    //must return a Array of searchAnswer, the search answer must be a object, key:url and key:title(must be string);

}