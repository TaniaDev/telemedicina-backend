const PacienteRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const patient = require('../middlewares/patient')
const PacienteController = require('../controllers/PacienteController')

PacienteRoutes
    .get('/:id', auth, patient, PacienteController.getPaciente)  
    .put('/:id', auth, patient, PacienteController.updatePaciente)
    .get('/getPaciente/:id_paciente', PacienteController.getPaciente) 

module.exports = PacienteRoutes