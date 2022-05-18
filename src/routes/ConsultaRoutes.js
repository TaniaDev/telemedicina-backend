const ConsultaRoutes = require('express').Router()

const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const doctor = require('../middlewares/doctor')
const patient = require('../middlewares/patient')

const ConsultaController = require('../controllers/ConsultaController')

ConsultaRoutes
    .post('/criar', auth, ConsultaController.criar)
    .put('/agendar/:id_consulta', auth, ConsultaController.agendar)
    .get('/obter', auth, ConsultaController.obterConsultas)
    .get('/obter_admin/:id', auth, admin, ConsultaController.obterConsultasPeloAdmin)  
    .get('/obter/:id_consulta', auth, ConsultaController.obterUmaConsultaPeloId)   
    .put('/cancelar/:id_consulta', auth, ConsultaController.cancelar)
    .put('/editar/:id_consulta', auth, admin, doctor, ConsultaController.atualizar)
    
    .get('/getMyAppointments/today', ConsultaController.getTodayAppointments)
    .get('/getMyAppointments/week', ConsultaController.getWeekAppointments)
    .get('/getMyAppointments/scheduled', ConsultaController.getScheduledLateAppointments)
    .get('/getMyAppointments/canceled', ConsultaController.getCanceledLateAppointments)

module.exports = ConsultaRoutes