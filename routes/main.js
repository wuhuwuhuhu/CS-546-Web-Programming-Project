const express = require('express');
const router = express.Router();
const questions = require('../data/questions')
const userData = require('../data/users');
let logOutFlag = false;

router.get('/', function(req,res)  {
    console.log("12312")
    if(req.session.user){
        res.render("main/mainpage");
    }else{
        res.redirect("/login")
    }
   
    
    return;
});
router.post('/search', async(req,res)=>{
    let search = req.body.data;
    let allQuestion = questions.getAllQuestions;
    // get the name for all question , using loop to return 
    let A = {returnSearch:[{url:'/20',name:'wtf1'},{url:'/1',name:'wtf2'},{url:'/1',name:'wtf3'}]};
    res.json(A);
})

router.post('/popular',async(req,res)=>{
    if(req.body.ask==true){
        let A = {returnPopular:[{url:'/201',name:'enen1'},{url:'/123',name:'enen2'},{url:'/172',name:'enen3'},{url:'/199',name:'enen4'},{url:'/188',name:'enen5'}]};
        res.json(A);
    }
})

function search_word(text, word){
    
    let x = 0, y=0;
   
    for (i=0;i< text.length;i++)
        {
        if(text[i] == word[0])
            {
            for(j=i;j< i+word.length;j++)
               {
                if(text[j]==word[j-i])
                  {
                    y++;
                  }
                if (y==word.length){
                    x++;
                }
            }
            y=0;
        }
    }
    if(x!=0){
        return true;
   }
}
module.exports = router;