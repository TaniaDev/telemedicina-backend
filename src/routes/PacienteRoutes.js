const PacienteRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const patient = require('../middlewares/patient')
const PacienteController = require('../controllers/PacienteController')

PacienteRoutes
    .post('/cadastrar', PacienteController.cadastrar)
    .get('/obter', auth, patient, PacienteController.obter)  
    .put('/:id', auth, patient, PacienteController.atualizar)
    .get('/obter/:id', auth, PacienteController.obterPacienteCompleto) 

module.exports = PacienteRoutes