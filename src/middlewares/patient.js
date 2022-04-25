const jwt_decode = require('jwt-decode')

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const decode = jwt_decode(authHeader)

    if (decode.tipo !== 'Paciente') {
        return res.status(401).json({ error: 'Acesso negado!' })
    }

    next()
}