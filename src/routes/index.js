const routes = require('express').Router()

const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')

routes
    //Index
    .get('/', (req, res) => {
        res.send('Index')
    })
    //Usuário
    .post('/cadastrar', UsuarioController.create)
    .get('/index', UsuarioController.index)
    .get('/usuario/:id', UsuarioController.read)
    .put('/usuario/editar/:id', UsuarioController.update)
    .delete('/usuario/:id', UsuarioController.delete)
    //Sessão
    .post('/login', SessaoController.login)
    //Consulta
    .post('/consulta', ConsultaController.create)
module.exports = routes
