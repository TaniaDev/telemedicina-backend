const express = require('express');
const routes = express.Router();

const UsuarioController = require('./controllers/UsuarioController')

routes
    .get('/usuario', UsuarioController.index)
    .post('/usuario', UsuarioController.create)
    .put('/usuario/:id', UsuarioController.update)
    .delete('/usuario/:id', UsuarioController.delete)

module.exports = routes