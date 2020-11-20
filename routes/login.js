const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userData = require('../data/users');
const xss = require('xss');

const title = "Login";
router.get('/', async (req, res) => {
    if (req.session.fromOtherPage === true) {
        req.session.fromOtherPage = null;
        res.render('login', {
            fromCoursePage: true,
            loginError: `You must be logged in to perform that action.`
        });
    } else {
        res.render('login',{title:title});
    }
});

router.post("/", async (req, res) => {
    const userPostData = req.body;
    try {
      const email = xss(userPostData.email);
      const password = userPostData.password;
      if (email && password) {
        const newUser = await userData.getUserByEmail(userPostData.email);
        if (newUser == null) {
          res.render("users/login", {
            title: "Login Page",
            logged_in: req.session && req.session.user ? true : false,
            errors: "Email or password is wrong",
          });
          return;
        }
        passwordMatch = await bcrypt.compare(
          userPostData.password,
          newUser.password
        );
        if (passwordMatch) {
          req.session.user = newUser;
  
          const hour = 3600000;
          req.session.cookie.maxAge = hour;
          res.redirect("users/" + newUser._id);
        } else {
          res.render("users/login", {
            title: "Login Page",
            logged_in: req.session && req.session.user ? true : false,
            errors: "Email or password is wrong",
          });
          return;
        }
      } else {
        res.status(400).send({ error: "Bad Request" });
      }
    } catch (e) {
      res.status(500).send({ error: e });
      console.log(e);
    }
  });

module.exports = router;
