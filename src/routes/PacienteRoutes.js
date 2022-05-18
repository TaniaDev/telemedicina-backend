const PacienteRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const patient = require('../middlewares/patient')
const doctor = require('../middlewares/doctor')
const PacienteController = require('../controllers/PacienteController')

PacienteRoutes
    .post('/cadastrar', PacienteController.cadastrar)
    .get('/obter', auth, patient, PacienteController.obter)
    .get('/obter_medico/:id_medico', auth, PacienteController.obterPacientesPeloMedico)
    .get('/obter_admin/:id', auth, admin, PacienteController.obterPeloAdmin)
    .put('/:id', auth, patient, PacienteController.atualizar)
    .get('/obter/:id', auth, PacienteController.obterPacienteCompleto) 

module.exports = PacienteRoutes