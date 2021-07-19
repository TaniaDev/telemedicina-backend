const model = require('./model');

const user = model({
    name: "usuario",
    tableName: "t_usuario",
});

const getAllUsers = async (req, res, next) => {
    let result = await user.findAll();
    res.send(result);
}

module.exports = { getAllUsers }