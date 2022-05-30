const UsuarioRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const UsuarioController = require('../controllers/UsuarioController')

UsuarioRoutes
    .post('/cadastrar', UsuarioController.cadastrar)    
    .get('/obter', auth, UsuarioController.obter)
    .get('/obter_admin/:id', auth, admin, UsuarioController.obterPeloAdmin)
    .put('/atualizar', auth, UsuarioController.atualizar)
    .put('/atualizar/endereco', auth, UsuarioController.atualizarEndereco)
    .put('/desativar', auth, UsuarioController.desativar)
    .delete('/deletar/:id', auth, UsuarioController.deletar)  
    .post('/esqueceu_senha', UsuarioController.esqueceu_senha)
    .put('/redefinir_senha', UsuarioController.redefinir_senha)
    .get('/obter/todos', auth, UsuarioController.obterUsuarios)

module.exports = UsuarioRoutes