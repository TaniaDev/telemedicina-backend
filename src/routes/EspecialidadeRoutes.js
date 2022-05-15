const EspecialidadeRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const EspecialidadeController = require('../controllers/EspecialidadeController')

EspecialidadeRoutes
    .post('/cadastrar', auth, admin, EspecialidadeController.cadastrarEspecialidade)
    .get('/obter/:id', auth, EspecialidadeController.obterUmaEspecialidade)
    .get('/obter', auth, EspecialidadeController.obterEspecialidades)

    .get('/obterEspecialidadesPeloMedico/:id_medico', auth, EspecialidadeController.obterEspecialidadesPeloMedico)
module.exports = EspecialidadeRoutes
    
    
