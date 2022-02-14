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
                    if(usuario.desativado_em != null){
                        await con('usuario').update({desativado_em: null}).where({email})
                    }

                    if(usuario.tipo == "Paciente"){
                        const paciente = await con('usuario').join('paciente', 'usuario.id', '=', 'paciente.id_usuario').select('*')
                        return res.json({ accessToken, paciente })
                    }else if(usuario.tipo == "Medico"){
                        const medico = await con('usuario').join('medico', 'usuario.id', '=', 'medico.id_usuario').select('*')
                        return res.json({ accessToken, medico })
                    }else{
                        return res.status(400).json({ message: "Tipo de usuário inválido" })
                    }
                } else {
                    return res.json({ message: "Credenciais Inválidas" })
                }
            }
        } catch (error) {
            next(error)
        }
    }
}
