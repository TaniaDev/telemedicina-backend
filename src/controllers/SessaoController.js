const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth');
const con = require('../database')

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    })
}

module.exports = {
    login: async (req, res, next) => {
        try {
            const { email, senha } = req.body
            const [usuario] = await con('usuario').select('*').where({ email }).limit(1)

            if (!usuario) {
                return res.status(403).json({ error: 'Usuário não encontrado' })
            } else {
                const match = await bcrypt.compare(senha, usuario.senha)
                const accessToken = jwt.sign({id: usuario.id}, authConfig.secret, {expiresIn: 86400,})

                if (match) {
                    usuario.senha = undefined;

                    return res.json({ usuario, accessToken})
                } else {
                    return res.json({ message: "Credenciais Inválidas" })
                }
            }
        } catch (error) {
            next(error)
        }
    }
}
