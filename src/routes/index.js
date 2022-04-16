const routes = require('express').Router()

const Usuario = require('./UsuarioRoutes')
const Paciente = require('./PacienteRoutes')
const Medico = require('./MedicoRoutes')
const Consulta = require('./ConsultaRoutes')
const Admin = require('./AdminRoutes')
const Sessao = require('./SessaoRoutes')

    routes
        .use('/api/usuario', Usuario)
        .use('/api/sessao', Sessao)
        .use('/api/paciente', Paciente)
        .use('/api/medico', Medico)
        .use('/api/admin', Admin)
        .use('/api/consulta', Consulta)
        .get('/ping', (_, res) => {res.send('pong')})

module.exports = routes
