const ConsultaRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const ConsultaController = require('../controllers/ConsultaController')

ConsultaRoutes
    .put('/agendar/:id_consulta', auth, ConsultaController.agendar) 
    .get('/getConsultasDisponiveis', auth, ConsultaController.getConsultasDisponiveis)   
    .put('/cancelar/:id_consulta', auth, ConsultaController.cancel)
    .put('/changeDate', auth, ConsultaController.changeDate)
    .post('/criar', auth, ConsultaController.create)
    .get('/getMyAppointments/all', ConsultaController.getMyAppointments)
    .get('/getMyAppointments/today', ConsultaController.getTodayAppointments)
    .get('/getMyAppointments/week', ConsultaController.getWeekAppointments)
    .get('/getMyAppointments/scheduled', ConsultaController.getScheduledLateAppointments)
    .get('/getMyAppointments/canceled', ConsultaController.getCanceledLateAppointments)
    .delete('/deletar/:id', auth, ConsultaController.delete)
    .get('/:id', auth, ConsultaController.getAppointment)

module.exports = ConsultaRoutes