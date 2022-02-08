const routes = require('express').Router()

const auth = require('../middlewares/auth')
const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')

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
    .post('/usuario/esqueceu_a_senha', UsuarioController.forgot_password)
    .post('/usuario/redefinir_senha/:token', UsuarioController.reset_passowrd)


module.exports = routes
