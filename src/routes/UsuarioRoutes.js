const UsuarioRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const UsuarioController = require('../controllers/UsuarioController')

UsuarioRoutes
    .post('/cadastrar', UsuarioController.cadastrar)    
    .get('/obter/:id', auth, UsuarioController.obter)  
    .put('/atualizar', auth, UsuarioController.atualizar)
    .put('/desativar', auth, UsuarioController.desativar)
    .delete('/deletar/:id', auth, UsuarioController.deletar)  

    .get('/getType', auth, UsuarioController.getType)
    .post('/esqueceu_a_senha', UsuarioController.forgot_password)    
    .post('/redefinir_senha/:token', UsuarioController.reset_passowrd)  
    .get('/getEmail/:token', UsuarioController.getEmail) 
    .get('/endereco', auth, UsuarioController.getEndereco)  
    .put('/endereco', auth, UsuarioController.updateEndereco)

module.exports = UsuarioRoutes