const con = require('../database')
const getCurrentTime = require('../utils/getCurrentTime')

module.exports = class UsuarioDAO {
    async cadastrar(usuario) {
        const {
            nome,
            dt_nascimento,
            genero,
            telefone,
            endereco,
            email,
            senha,
            tipo
        } = usuario

        const [novoUsuario] = await con('usuario')
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
        await con('endereco')
                        .insert({
                            id_usuario: novoUsuario.id,
                            cep: endereco.cep,
                            logradouro: endereco.logradouro,
                            bairro: endereco.bairro,
                            numero: endereco.numero,
                            complemento: endereco.complemento,
                            cidade: endereco.cidade,
                            estado: endereco.estado
                        })
                        .where({ id_usuario: novoUsuario.id })
        return novoUsuario
    }

    async obterUmPeloId(id) {
        const [usuario] = await con('usuario')
                            .select(
                                'usuario.nome',
                                'usuario.dt_nascimento',
                                'usuario.genero',
                                'usuario.telefone',
                                'usuario.email',
                                'usuario.tipo',
                                'endereco.cep',
                                'endereco.logradouro',
                                'endereco.bairro',
                                'endereco.numero',
                                'endereco.complemento',
                                'endereco.cidade',
                                'endereco.estado'
                            )
                            .from('usuario')
                            .join('endereco', { 'usuario.id': 'endereco.id_usuario' })
                            .andWhere({ id })
                            .limit(1)
        return usuario
    }

    async obterUmPeloEmail(email) {
        const [usuario] = await con('usuario')
                            .where({ email })
                            .select(
                                'usuario.nome',
                                'usuario.email',
                                'usuario.tipo'
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
        const usuarioAtualizado = await con('usuario')
                            .update({
                                nome,
                                dt_nascimento,
                                genero,
                                telefone,
                                email,
                                senha,
                                atualizado_em: getCurrentTime()
                            })
                            .where({ id })
               
        return usuarioAtualizado
    }

    async atualizarEndereco(endereco) {
        const {
            id,
            cep,
            logradouro,
            numero,
            bairro,
            complemento,
            cidade,
            estado
        } = endereco
        return await con('endereco')
                        .update({
                            cep,
                            logradouro,
                            numero,
                            bairro,
                            complemento,
                            cidade,
                            estado,
                            atualizado_em: getCurrentTime()
                        })
                        .where({ id_usuario: id })
    }

    async atualizarSenhaPeloEmail(senha, email) {
        return await con('usuario')
                        .update({
                            senha,
                            atualizado_em: getCurrentTime()                        
                        })
                        .where({ email })
    }

    async deletar(id) {
        return await con('usuario')
                        .where({ id })
                        .del()
    }

    async desativar(id) {
        return await con('usuario')
                        .where({ id })
                        .update({ desativado_em: getCurrentTime() })
    }

    async obterTodosUsuarios(id, page) {
        const usuarios = await con('usuario').where({ 'desativado_em': null })
        //.limit(10)
            //.offset((page - 1) * 10)
            //.orderBy('id')

        {/*if (id) {
            query
            .where({ id })
            .select('usuario.email')
        }*/}

        return usuarios
    }
}
