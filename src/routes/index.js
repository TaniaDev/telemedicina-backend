const routes = require('express').Router()

const auth = require('../middlewares/auth')
const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')

routes
    //Sessão
    .post('/login', SessaoController.login) //ok
    .post('/bla', SessaoController.decoded) //ok

    //Index (Testando o middleware de autenticação)
    .get('/', auth, (req, res) => {
        res.status(200).send({ ok: true })
    })

    //Usuário
    .post('/cadastrar', UsuarioController.create)    //OK
    .get('/index', auth, UsuarioController.index)   // - ok
    .get('/usuario/:id', auth, UsuarioController.read)  // - ok
    .put('/usuario/editar/:id', auth, UsuarioController.update) // ok
    .put('/usuario/:id', auth, UsuarioController.disable)   //ok
    .post('/usuario/esqueceu_a_senha', UsuarioController.forgot_password)   // - ok 
    .post('/usuario/redefinir_senha/:token', UsuarioController.reset_passowrd)  // - ok

    //Consulta
    .post('/paciente/consulta/agendar', auth, ConsultaController.create)    // ok
    .put('/consulta/cancelar', auth, ConsultaController.cancel)
    
module.exports = routes
