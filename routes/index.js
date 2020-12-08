const userRoutes = require("./users");
const askRoutes = require('./ask')

const constructorMethod = (app) => {
    app.use('/user', userRoutes);
    app.use('/ask', askRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(400);
    })
}

module.exports = constructorMethod;
