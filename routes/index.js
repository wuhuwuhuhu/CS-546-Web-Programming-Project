const userRoutes = require("./users");

const constructorMethod = (app) => {
    app.use('/user', userRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(400);
    })
}

module.exports = constructorMethod;