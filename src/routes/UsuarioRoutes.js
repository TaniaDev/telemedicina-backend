const UsuarioRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const UsuarioController = require('../controllers/UsuarioController')

UsuarioRoutes
    .post('/cadastrar', UsuarioController.cadastrar)    
    .get('/obter/:id', auth, UsuarioController.obter)  
    .put('/atualizar', auth, UsuarioController.atualizar)
    .put('/desativar', auth, UsuarioController.desativar)
    .delete('/deletar/:id', auth, UsuarioController.deletar)  
    .post('/esqueceu_senha', UsuarioController.esqueceu_senha)
    .post('/redefinir_senha', UsuarioController.redefinir_senha)
    
    .put('/endereco', auth, UsuarioController.updateEndereco)

module.exports = UsuarioRoutes