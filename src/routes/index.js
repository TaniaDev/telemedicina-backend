const routes = require('express').Router()

const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')
const MedicoController = require('../controllers/MedicoController')
const PacienteController = require('../controllers/PacienteController')
const auth = require('../middlewares/auth')
const patient = require('../middlewares/patient')
const doctor = require('../middlewares/doctor')

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
    .get('/index', auth, UsuarioController.index)   
    .get('/usuario', auth, UsuarioController.read)  
    .put('/usuario/editar', auth, UsuarioController.update)
    .put('/usuario/disable', auth, UsuarioController.disable)  
    .post('/usuario/esqueceu_a_senha', UsuarioController.forgot_password)    
    .post('/usuario/redefinir_senha/:token', UsuarioController.reset_passowrd)  
    .get('/usuario/endereco', auth, UsuarioController.getEndereco)  
    .put('/usuario/endereco', auth, UsuarioController.updateEndereco)  

    //Paciente
    .get('/paciente', auth, patient, PacienteController.getPaciente)  
    .put('/paciente', auth, patient, PacienteController.updatePaciente)  

    //Médico
    .get('/medico/especialidades', MedicoController.getAllSpecialties)
    .get('/medico/getDoctors', MedicoController.getDoctors)
    .get('/medico/getDoctor/:id_medico', MedicoController.getDoctor)
    .get('/medico/getSpecialtie/:id_especialidade', MedicoController.getSpecialtie)
    .post('/medico/registerSpecialty', doctor, MedicoController.registerSpecialty)
    .get('/medico/disponibilidade', MedicoController.doctorAvailability)

    //Consulta
    .post('/paciente/consulta/agendar', auth, ConsultaController.create)   
    .put('/consulta/cancelar', auth, ConsultaController.cancel)
    .put('/consulta/changeDate', auth, ConsultaController.changeDate)
    .get('/consulta/getMyAppointments', auth, ConsultaController.getMyAppointments)
    
module.exports = routes
