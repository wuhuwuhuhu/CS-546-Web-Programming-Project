const userRoutes = require("./users");
const askRoutes = require('./ask')
const loginRoutes = require('./login');
const mainRoutes = require('./main');
const questionRoutes = require('./question')
// const regist = require("./registration")
// const logout = require("./logout")
const constructorMethod = (app) => {
    app.use('/user', userRoutes);
    app.use('/ask', askRoutes);
    app.use('/question', questionRoutes);
    // app.use(regist);
    app.use('/login',loginRoutes);
    // app.use('/logout',logout);
    app.use('/',mainRoutes)
    app.use("*", (req, res) => {
        res.sendStatus(400);
    })
}

module.exports = constructorMethod;