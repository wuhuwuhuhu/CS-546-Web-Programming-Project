const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userData = require('../data/users');
const xss = require('xss');

if(req.session.userInfo){
    let { userInfo } = req.session
    res.render("pages/home", { userInfo: userInfo })
  }else{
    res.render("pages/login", {})
  }
 

});
router.get("/regist", async (req, res) => {
  res.render("pages/register")
})
router.post("/regist", async (req, res) => {

  let { username, password } = req.body
  if (username == "" || username.length < 5) {
    res.render("pages/register", { error: "please check username length >5 and not empty" })
    return
  }
  if (password == "" || password.length < 5) {
    res.render("pages/register", { error: "please check password length >5  and not empty" })
    return
  }
  if(email == ""){
    res.render("pages/register", { error: "please check email not empty" })
    return
  }
  let list = userList.filter(item => item.username == username)
  if (list.length > 0) {
    res.render("pages/register", { error: "The user name is already registered" })
    return
  } else {
    userList.push(req.body)
    res.json({ status: 1, msg: "regist success" })
    return
  }
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  let list = userList.filter(item => item.username == username)
  if (list.length > 0) {
    if (list[0].password == password) {
      req.session.userInfo = list[0]
      res.render("pages/home", { userInfo: list[0] })
    } else {
      res.render("pages/login", { error: "Please check that the user name and password are correct " })
      return
    }
  } else {
    res.render("pages/login", { error: "Please check that the user name and password are correct " })
    return
  }

})
function islogin(req, res, next) {
  if (req.session.userInfo) {
    next()
  } else {
    res.render("pages/login", {})
  }
}

router.get("/private", islogin, async (req, res) => {
  let { userInfo } = req.session
  res.render("pages/home", { userInfo: userInfo })
})
router.get('/logout', async (req, res) => {
	req.session.destroy();
	res.render('logout', {title: 'Logged Out'});
});


module.exports = router;

