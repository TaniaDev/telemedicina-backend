const routes = require('express').Router();

const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')

routes
    //Usuário
    .get('/index', UsuarioController.index)
    .get('/usuario/:id', UsuarioController.read)
    .post('/cadastro', UsuarioController.create)
    .put('/usuario/editar/:id', UsuarioController.update)
    .delete('/usuario/:id', UsuarioController.delete)
    //Sessao
    .post('/login', SessaoController.login)
    //Consulta
    .post('/consulta', ConsultaController.create)
module.exports = routes
