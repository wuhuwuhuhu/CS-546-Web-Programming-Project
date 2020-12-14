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

  let { email, hashedPassword, userName } = req.body;
  email = xss(email);
  hashedPassword = xss(hashedPassword);
  userName = xss(userName);
  email = email.toLowerCase();
    let error_msgs = [];
    try {
        await userData.getUserByEmail(email);
        res.render('registration', {
            found: "Email is already registered",
            hasEmail: true,
            title: "Register an account"
        });
        return;
    } catch (e) {
     
        
        if (!userName) {
            error_msgs.push("Must provide userName.");
        }
        if (!email) {
            error_msgs.push("Must provide valid email.");
        }
        if(!email.includes("@"))
        {
            error_msgs.push("You must provide a valid email.");
        }
        if (!hashedPassword) {
            error_msgs.push("Must provide valid password.")
        }
        if( userName<3 || email.length<3 || password.length<3){
          error_msgs.push("Not enough characters.");
      }
        if( userName>16 || email.length >16 || password.length >16){
            error_msgs.push("Character count exceeded.");
        }
        if (error_msgs.length !== 0) {
            res.render('registration', {
                error_messages: error_msgs,
                hasErrors: true,
                title: "Register an account"
            });
        } else {
            try {
                await userData.addUser(
                    userName,
                    email, 
                    password
                );
                res.render('registersuccess', {title: "Account created"});
            } catch (e) {
                console.log(e);
                error_msgs.push("There was an error registering your account. Please try again later.")
                res.render('registration', {
                    title: "Register an account",
                    hasErrors: true,
                    error_messages: error_msgs
                });
            }
        }
    }
});

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

module.exports = router;
