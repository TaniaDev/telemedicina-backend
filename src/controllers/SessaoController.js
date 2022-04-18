const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfig = require('../config/auth');
const con = require('../database')

module.exports = {
    login: async (req, res, next) => {
        try {
            const { email, senha } = req.body
            const [usuario] = await con('usuario').select('*').where({ email }).limit(1)

            if (!usuario) {
                return res.status(403).json({ error: 'Usuário não encontrado' })
            } else {
                const match = await bcrypt.compare(senha, usuario.senha)
                const accessToken = jwt.sign({
                    id: usuario.id,
                    nome: usuario.nome,
                    tipo: usuario.tipo
                }, authConfig.secret, {expiresIn: 86400,})

                if (match) {
                    if(usuario.desativado_em != null){
                        await con('usuario').update({desativado_em: null}).where({email})
                    }

                    const result = await con('usuario').where({id: usuario.id})
                    
                    return res.status(200).json({ accessToken, result })

                } else {
                    return res.status(401).json({ message: "Credenciais Inválidas" })
                }
            }
        } catch (error) {
            next(error)
        }
    },
    
}
