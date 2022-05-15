const MedicoRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const doctor = require('../middlewares/doctor')
const admin = require('../middlewares/admin')
const MedicoController = require('../controllers/MedicoController')

MedicoRoutes
    .post('/cadastrar', MedicoController.cadastrar)
    .get('/obter', auth, MedicoController.obter)
    .get('/obter/:id_medico', auth, doctor, MedicoController.obterPeloParams)
    .get('/obter/completo', auth, doctor, MedicoController.obterMedicoCompleto)
    
    .get('/obterTodos', auth, admin, MedicoController.obterMedicos)
    .get('/obterMedicosPelaEspecialidade/:id_especialidade', auth, MedicoController.obterMedicosPelaEspecialidade)

module.exports = MedicoRoutes
    