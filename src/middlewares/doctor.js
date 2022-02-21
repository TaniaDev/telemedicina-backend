const jwt_decode = require('jwt-decode')

const con = require('../database')


module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const decode = jwt_decode(authHeader)

    const [usuario] = await con('usuario').where({ id: decode.id })

    if (usuario.tipo != 'Medico') {
        return res.status(401).json({ error: 'Acesso negado!' })
    }

    next()
}