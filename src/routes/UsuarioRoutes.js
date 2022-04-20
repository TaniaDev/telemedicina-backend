const UsuarioRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const UsuarioController = require('../controllers/UsuarioController')

UsuarioRoutes
    .post('/cadastrar', UsuarioController.cadastrar)    
    .get('/obter', auth, UsuarioController.obter)  
    .put('/atualizar', auth, UsuarioController.atualizar)
    .put('/atualizar/endereco', auth, UsuarioController.atualizarEndereco)
    .put('/desativar', auth, UsuarioController.desativar)
    .delete('/deletar/:id', auth, UsuarioController.deletar)  
    .post('/esqueceu_senha', UsuarioController.esqueceu_senha)
    .post('/redefinir_senha', UsuarioController.redefinir_senha)

module.exports = UsuarioRoutes