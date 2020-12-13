const express = require('express');
const router = express.Router();
const userData = require('../data/users');
const xss = require('xss');
router.get("/registration", async (req, res) => {
  res.render('login/registration', {
    title: "Register an account"
});
})
router.post("/registration", async (req, res) => {

  let {email, hashedPassword, userName} = req.body;
  email = xss(email);
  hashedPassword = xss(hashedPassword);
  userName = xss(userName);
  let error = [];
  console.log(email, hashedPassword, userName)
  try{
    let result =  await userData.addUser(email, hashedPassword, userName)
    if(result){
      res.render('login/registersuccess', {title: "Account created"});
    }
  }catch(err){
    if(err){
        res.render('login/registration', {
        found: `${err}`,
        hasEmail: true,
        title: "Register an account"
      });
    }
  }
 
  // try{
  //     await userData.getUserByEmail(email);
  //     res.render('regist', {
  //       found: "Email is already registered",
  //       hasEmail: true,
  //       title: "Register an account"
  //     });
  //     return;
  // } catch(e) {
  //   if(!email){
  //     error.push("You must provide email");
  //   }
  //   if(!name){
  //     error.push("you must provide name");
  //   }
  //   if(!hashedPassword){
  //     error.push("You must provide password.");
  //   }
  //   if (error_msgs.length !== 0) {
  //     res.render('registration', {
  //         error: error_msgs,
  //         hasErrors: true,
  //         title: "Register an account"
  //     });
  //   }else {
  //     try{await userData.addUser(
  //       email,
  //       name,
  //       hashedPassword
  //     );
  //     res.render('registersuccess', {title: "Account created"});

  //     }catch(e){
  //       console.log(e);
  //       error.push("There was an error registering your account. Please try again later.")
  //       res.render('registration', {
  //         title: "Register an account",
  //         hasErrors: true,
  //         error: error_msgs
  //     });
  //   }
  // }
  // }
});
module.exports = router;