const routes = require('express').Router();

const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')

routes
    //Usuário
    .get('/index', UsuarioController.index)
    .post('/cadastro', UsuarioController.create)
    .put('/usuario/:id', UsuarioController.update)
    .delete('/usuario/:id', UsuarioController.delete)
    //Sessao
    .post('/login', SessaoController.login)

module.exports = routes
