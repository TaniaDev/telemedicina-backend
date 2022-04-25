const EspecialidadeRoutes = require('express').Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const EspecialidadeController = require('../controllers/EspecialidadeController')

EspecialidadeRoutes
    .post('/especialidade/cadastrar', auth, admin, EspecialidadeController.cadastrarEspecialidade)
    .get('/especialidade/:id', auth, EspecialidadeController.obterUmaEspecialidade)
    .get('/especialidade/obter', auth, EspecialidadeController.obterEspecialidades)

    .get('/obterEspecialidadesPeloMedico/:id_medico', auth, EspecialidadeController.obterEspecialidadesPeloMedico)
module.exports = EspecialidadeRoutes
    
    
