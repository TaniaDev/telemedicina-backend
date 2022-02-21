const routes = require('express').Router()

const UsuarioController = require('../controllers/UsuarioController')
const SessaoController = require('../controllers/SessaoController')
const ConsultaController = require('../controllers/ConsultaController')
const MedicoController = require('../controllers/MedicoController')
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
    .post('/cadastrar', UsuarioController.create)   
    .get('/index', auth, UsuarioController.index)   
    .get('/usuario/:id', auth, UsuarioController.read)  
    .put('/usuario/editar/:id', auth, UsuarioController.update)
    .put('/usuario/:id', auth, UsuarioController.disable)  
    .post('/usuario/esqueceu_a_senha', UsuarioController.forgot_password)    
    .post('/usuario/redefinir_senha/:token', UsuarioController.reset_passowrd)  

    //Médico
    .get('/medico/especialidades', doctor, MedicoController.getAllSpecialties)
    .get('/medico/getDoctors', MedicoController.getDoctors)
    .post('/medico/registerSpecialty', doctor, MedicoController.registerSpecialty)
    .get('/medico/disponibilidade', MedicoController.doctorAvailability)

    //Consulta
    .post('/paciente/consulta/agendar', auth, ConsultaController.create)   
    .put('/consulta/cancelar', auth, ConsultaController.cancel)
    .put('/consulta/changeDate', auth, ConsultaController.changeDate)
    .get('/consulta/getMyAppointments', auth, ConsultaController.getMyAppointments)
    
module.exports = routes
