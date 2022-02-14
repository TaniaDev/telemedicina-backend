const routes = require('express').Router()

const auth = require('../middlewares/auth')
const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')

routes
    //Usuário
    .post('/cadastrar', UsuarioController.create)
    //Sessão
    .post('/login', SessaoController.login)

routes
    //Index
    .get('/', auth, (req, res) => {
        res.status(200).send({ ok: true })
    })
    //Usuário

    .get('/index', UsuarioController.index)
    .get('/usuario/:id', UsuarioController.read)
    .put('/usuario/editar/:id', UsuarioController.update)
    .delete('/usuario/:id', UsuarioController.delete)
    .put('/usuario/:id', UsuarioController.disable)
    //Sessão
    .post('/login', SessaoController.login)
    .post('/usuario/esqueceu_a_senha', UsuarioController.forgot_password)
    .post('/usuario/redefinir_senha/:token', UsuarioController.reset_passowrd)


    //Consulta
    .put('/consulta/cancelar', ConsultaController.cancel)
module.exports = routes
