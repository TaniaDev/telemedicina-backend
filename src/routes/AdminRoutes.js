const AdminRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/patient')
const AdminController = require('../controllers/AdminController')

AdminRoutes
    .post('/especialidade/cadastrar', AdminController.cadastrarEspecialidade)
    .get('/especialidade/:id', AdminController.obterUmaEspecialidade)
    .get('/', auth, admin, AdminController.index)
    .get('/consultas/:id', auth, admin, AdminController.getAppointments)
module.exports = AdminRoutes
    