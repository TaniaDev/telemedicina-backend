const routes = require('express').Router()

const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')
const AdminController = require('../controllers/AdminController')
const MedicoController = require('../controllers/MedicoController')
const PacienteController = require('../controllers/PacienteController')
const ProntuarioController = require('../controllers/ProntuarioController')
const ScheduledController = require('../controllers/ScheduledController')

const auth = require('../middlewares/auth')
const patient = require('../middlewares/patient')
const doctor = require('../middlewares/doctor')
const admin = require('../middlewares/admin')
const verifyAppointments = require('../middlewares/verifyAppointments')

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
    .post('/usuario/createUser', UsuarioController.createUser)    
    .get('/usuario', auth, UsuarioController.read)  
    .put('/usuario/editar', auth, UsuarioController.update)
    .put('/usuario/updateDadosPessoais', auth, UsuarioController.updateDadosPessoais)
    .put('/usuario/disable', auth, UsuarioController.disable)
    .delete('/usuario/:id', auth, UsuarioController.delete)  
    .post('/usuario/esqueceu_a_senha', UsuarioController.forgot_password)    
    .post('/usuario/redefinir_senha/:token', UsuarioController.reset_passowrd)  
    .get('/usuario/getEmail/:token', UsuarioController.getEmail) 
    .get('/usuario/getUserByEmail/:email', UsuarioController.getUserByEmail) 
    .get('/usuario/getUserById', UsuarioController.getUserById) 
    .post('/usuario/endereco', UsuarioController.createEndereco) 
    .get('/usuario/endereco', auth, UsuarioController.getEndereco) 
    .put('/usuario/endereco', auth, UsuarioController.updateEndereco)  

    //Paciente
    .post('/paciente', PacienteController.createPaciente)  
    .get('/paciente', auth, patient, PacienteController.getPacienteById)  
    .put('/paciente', auth, patient, PacienteController.updatePaciente)
    .get('/paciente/getPaciente/:id_paciente', PacienteController.getPaciente) 

    //Médico
    .post('/medico/createDoctor', MedicoController.createDoctor)
    .post('/medico/createDoctorSpecialty', MedicoController.createDoctorSpecialty)
    .get('/medico/especialidades', MedicoController.getAllSpecialties)
    .get('/medico/getDoctors', MedicoController.getDoctors)
    .get('/medico/getNewDoctors', MedicoController.getNewDoctors)
    .get('/medico/getDoctorsBySpecialty/:id_specialty', MedicoController.getDoctorsBySpecialty)
    .delete('/medico/medico_especialidade/:id_medico/:id_especialidade', MedicoController.delMedicoEspecialidade)
    .put('/medico/validar_medico/:id_medico/:nome/:email', MedicoController.validarMedico)
    .delete('/medico/reprovarMedico/:id_medico/:nome/:email', MedicoController.reprovarMedico)
    .get('/medico/getDoctor/:id_medico', MedicoController.getDoctor)
    .get('/medico/getSpecialtie/:id_especialidade', MedicoController.getSpecialtie)
    .get('/medico/getSpecialtieByDoctor/:id_medico', MedicoController.getSpecialtieByDoctor)
    .get('/medico/getSpecialityByDoctor', MedicoController.getSpecialityByDoctor)
    .post('/medico/registerSpecialty', doctor, MedicoController.registerSpecialty)
    .get('/medico/disponibilidade', MedicoController.doctorAvailability)
    .get('/medico/verifyapproval/:email', MedicoController.verifyApproval)

    //Admin
    .get('/admin', auth, admin, AdminController.index)
    .get('/admin/consultas/:id', auth, admin, AdminController.getAppointments)

    //Consulta
    .put('/consulta/agendar/:id_consulta', auth, ConsultaController.agendar) 
    .post('/agendarconsulta', auth, verifyAppointments, ConsultaController.agendarconsulta) 
    .get('/horasdisponiveismedico/:id_medico/:data', auth, ConsultaController.horasdisponiveismedico) 
    .get('/getDiasDaSemana', auth, ConsultaController.getDiasDaSemana) 
    .post('/definirDisponibilidadeMedica', auth, doctor, ConsultaController.definirDisponibilidadeMedica) 
    .delete('/definirDisponibilidadeMedica', auth, doctor, ConsultaController.cleanRecords) 
    .get('/getDisponibilidadeMedica', auth, doctor, ConsultaController.getDisponibilidadeMedica) 
    .get('/consulta/getConsultasDisponiveis', auth, ConsultaController.getConsultasDisponiveis)   
    .put('/consulta/cancelar/:id_consulta', auth, ConsultaController.cancel)
    .put('/consulta/changeDate', auth, ConsultaController.changeDate)
    .post('/consulta/criar', auth, ConsultaController.create)
    .get('/consultas/getMyAppointments/all', ConsultaController.getMyAppointments)
    .get('/consultas/getPatientAppointments', ConsultaController.getPatientAppointments)
    .get('/consultas/getDoctorAppointments', ConsultaController.getDoctorAppointments)
    .get('/consultas/getMyAppointments/today', ConsultaController.getTodayAppointments)
    .get('/consultas/getMyAppointments/week', ConsultaController.getWeekAppointments)
    .get('/consultas/getMyAppointments/scheduled', ConsultaController.getScheduledLateAppointments)
    .get('/consultas/getMyAppointments/canceled', ConsultaController.getCanceledLateAppointments)
    .delete('/admin/consultas/deletar/:id', auth, ConsultaController.delete)
    .get('/consulta/:id', auth, ConsultaController.getAppointment)
    .put('/consulta/done/:id', auth, ConsultaController.done)

    //Prontuario
    .get('/prontuario/:id_paciente', auth, doctor, ProntuarioController.getProntuario) 
    .post('/prontuario', auth, doctor, ProntuarioController.createProntuario) 


    // CRON
    .get('/ScheduledController', ScheduledController.sendNotification)

module.exports = routes
