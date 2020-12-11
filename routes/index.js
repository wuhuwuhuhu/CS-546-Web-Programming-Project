const userRoutes = require("./users");
const askRoutes = require('./ask')
const mainRoutes = require('./main')

const constructorMethod = (app) => {
    app.use('/user', userRoutes);
    app.use('/ask', askRoutes);
    app.use('/login', loginRoutes);
    app.use('/logout', logoutRoutes);
    app.use('/registration',registRoutes)

    app.use("*", (req, res) => {
        res.sendStatus(400);
    })
}

module.exports = constructorMethod;
