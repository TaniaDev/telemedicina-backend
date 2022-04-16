const SessaoRoutes = require('express').Router()
const SessaoController = require('../controllers/SessaoController')

SessaoRoutes
    .post('/login', SessaoController.login)

module.exports = SessaoRoutes
    

