const con = require('../database')

module.exports = class UsuarioDAO {
    async cadastrar(usuario) {
        const {
            nome,
            dt_nascimento,
            genero,
            telefone,
            email,
            senha,
            tipo,
        } = usuario
        return await con('usuario')
                        .insert({
                            nome,
                            dt_nascimento,
                            genero,
                            telefone,
                            email,
                            senha,
                            tipo
                        })
                        .returning('id')
    }

    async obterUmPeloId(id) {
        const [usuario] = await con('usuario')
                            .where({ id })
                            .select(
                                'usuario.nome',
                                'usuario.genero',
                                'usuario.telefone',
                                'usuario.email',
                                'usuario.senha'
                            )
                            .limit(1)
        return usuario
    }

    async obterUmPeloEmail(email) {
        const [usuario] = await con('usuario')
                            .where({ email })
                            .select(
                                'usuario.email'
                            )
                            .limit(1)
        return usuario
    }

    async atualizar(usuario) {
        const {
            id,
            nome,
            dt_nascimento,
            genero,
            telefone,
            email,
            senha
        } = usuario
        return await con('usuario')
                        .update({
                            nome,
                            dt_nascimento,
                            genero,
                            telefone,
                            email,
                            senha
                        })
                        .where({ id })
    }

    async deletar(usuario) {
        return await con('usuario')
                        .where({ id })
                        .del()
    }

    async desativar(usuario) {
        return await con('usuario')
                        .update({desativado_em: now})
                        .where({ id })
    }
    
}
