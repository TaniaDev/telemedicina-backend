const con = require('../database/database')

module.exports = {
    login: async (req, res) => {
        const { email, senha } = req.body
        const [usuario] = await con('usuario').select('*').where({ email }).limit(1)

        if (!usuario) {
            return res.status(403).json({ error: 'Usuário não encontrado' })
        }

        if (senha !== usuario.senha) {
            return res.status(403).json({ error: 'Senha'})
        }

        return res.json({
            id: usuario.id,
            email,
            token: 'sdjfaiuh48547adsjaoj54l5'
        })
    }
}