const SessaoRoutes = require('express').Router()
const SessaoController = require('../controllers/SessaoController')

SessaoRoutes
    .post('/', SessaoController.login)

module.exports = SessaoRoutes
    

