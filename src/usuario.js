const express = require('express')
const router = express.Router()

const con = require('./connection');

router.post('/criar', async (req, res) => {
    await con('t_usuario').insert({nome: 'Fulaninho'})
    res.send()

});

router.get('/listarUsuarios', async (req, res) => {
    const lista = await con('t_usuario').select('*')
    console.log(lista)
    res.send()
})

module.exports = router
