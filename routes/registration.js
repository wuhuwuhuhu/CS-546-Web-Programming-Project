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
  console.log(email, hashedPassword, userName)
  try {
    let result = await userData.addUser(email, hashedPassword, userName)
    if (result) {
      res.render('login/registersuccess', { title: "Account created" });
    }
  } catch (err) {
    if (err) {
      res.json({
        found: `${err}`,
        status: 0
      });
    }
  }
});
module.exports = router;