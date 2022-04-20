const MedicoRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const doctor = require('../middlewares/patient')
const MedicoController = require('../controllers/MedicoController')

MedicoRoutes
    .post('/cadastrar', MedicoController.cadastrar)
    .get('/obter', auth, MedicoController.obter)
    .get('/obter/completo', auth, MedicoController.obterMedicoCompleto)
    
    .get('/especialidades', MedicoController.getAllSpecialties)
    .get('/getDoctors', MedicoController.getDoctors)
    .get('/getDoctorsBySpecialty/:id_specialty', MedicoController.getDoctorsBySpecialty)
    .get('/getDoctor/:id_medico', MedicoController.getDoctor)
    .get('/getSpecialtie/:id_especialidade', MedicoController.getSpecialtie)
    .get('/getSpecialtieByDoctor/:id_medico', MedicoController.getSpecialtieByDoctor)
    .post('/registerSpecialty', doctor, MedicoController.registerSpecialty)
    .get('/disponibilidade', MedicoController.doctorAvailability)

module.exports = MedicoRoutes

    