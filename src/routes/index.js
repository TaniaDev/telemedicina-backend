const routes = require('express').Router()

const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')
const AdminController = require('../controllers/AdminController')
const MedicoController = require('../controllers/MedicoController')
const PacienteController = require('../controllers/PacienteController')
const auth = require('../middlewares/auth')
const patient = require('../middlewares/patient')
const doctor = require('../middlewares/doctor')
const admin = require('../middlewares/admin')

routes
    //Sessão
    .post('/login', SessaoController.login)

    //Index (Testando o middleware de autenticação)
    .get('/', auth, (req, res) => {
        res.status(200).send({ ok: true })
    })

    //Usuário
    .get('/usuario/getType', auth, UsuarioController.getType)
    .post('/cadastrar', UsuarioController.create)    
    .get('/usuario', auth, UsuarioController.read)  
    .put('/usuario/editar', auth, UsuarioController.update)
    .put('/usuario/disable', auth, UsuarioController.disable)
    .delete('/usuario/:id', auth, UsuarioController.delete)  
    .post('/usuario/esqueceu_a_senha', UsuarioController.forgot_password)    
    .post('/usuario/redefinir_senha/:token', UsuarioController.reset_passowrd)  
    .get('/usuario/getEmail/:token', UsuarioController.getEmail) 
    .get('/usuario/getUserByEmail/:email', UsuarioController.getUserByEmail) 
    .get('/usuario/endereco', auth, UsuarioController.getEndereco)  
    .put('/usuario/endereco', auth, UsuarioController.updateEndereco)  

    //Paciente
    .get('/paciente', auth, patient, PacienteController.getPaciente)  
    .put('/paciente', auth, patient, PacienteController.updatePaciente)
    .get('/paciente/getPaciente/:id_paciente', PacienteController.getPaciente) 

    //Médico
    .get('/medico/especialidades', MedicoController.getAllSpecialties)
    .get('/medico/getDoctors', MedicoController.getDoctors)
    .get('/medico/getDoctorsBySpecialty/:id_specialty', MedicoController.getDoctorsBySpecialty)
    .get('/medico/getDoctor/:id_medico', MedicoController.getDoctor)
    .get('/medico/getSpecialtie/:id_especialidade', MedicoController.getSpecialtie)
    .get('/medico/getSpecialtieByDoctor/:id_medico', MedicoController.getSpecialtieByDoctor)
    .post('/medico/registerSpecialty', doctor, MedicoController.registerSpecialty)
    .get('/medico/disponibilidade', MedicoController.doctorAvailability)

    //Admin
    .get('/admin', auth, admin, AdminController.index)
    .get('/admin/consultas/:id', auth, admin, AdminController.getAppointments)

    //Consulta
    .put('/consulta/agendar/:id_consulta', auth, ConsultaController.agendar) 
    .get('/consulta/getConsultasDisponiveis', auth, ConsultaController.getConsultasDisponiveis)   
    .put('/consulta/cancelar/:id_consulta', auth, ConsultaController.cancel)
    .put('/consulta/changeDate', auth, ConsultaController.changeDate)
    .post('/consulta/criar', auth, ConsultaController.create)
    .get('/consultas/getMyAppointments/all', ConsultaController.getMyAppointments)
    .get('/consultas/getMyAppointments/today', ConsultaController.getTodayAppointments)
    .get('/consultas/getMyAppointments/week', ConsultaController.getWeekAppointments)
    .get('/consultas/getMyAppointments/scheduled', ConsultaController.getScheduledLateAppointments)
    .get('/consultas/getMyAppointments/canceled', ConsultaController.getCanceledLateAppointments)
    .delete('/admin/consultas/deletar/:id', auth, ConsultaController.delete)
    .get('/consulta/:id', auth, ConsultaController.getAppointment)

module.exports = routes
