const userRoutes = require("./users");
const askRoutes = require('./ask')
const mainRoutes = require('./main')
const questionRoutes = require('./question')

const constructorMethod = (app) => {
    app.use('/user', userRoutes);
    app.use('/ask', askRoutes);
    app.use('/question', questionRoutes);
    app.use('/',mainRoutes)
    app.use("*", (req, res) => {
        res.sendStatus(400);
    })
}

module.exports = constructorMethod;
