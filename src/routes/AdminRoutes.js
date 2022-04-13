const AdminRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/patient')
const AdminController = require('../controllers/AdminController')

AdminRoutes
    .get('/', auth, admin, AdminController.index)
    .get('/consultas/:id', auth, admin, AdminController.getAppointments)
module.exports = AdminRoutes
    